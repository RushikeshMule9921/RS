import firebase_admin
from firebase_admin import auth, credentials
import logging
#--
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import pandas as pd
import numpy as np
from transformers import AutoTokenizer,AutoModel
import torch
import torch.nn.functional as F
import itertools
import math
import pickle
import fitz  # PyMuPDF
###
import spacy
from spacy.matcher import PhraseMatcher

# load default skills data base
from skillNer.general_params import SKILL_DB
# import skill extractor
from skillNer.skill_extractor_class import SkillExtractor
import spacy
from spacy.matcher import Matcher
import PyPDF2
import csv
#------------------------------------------------------
# init params of skill extractor
nlp = spacy.load("en_core_web_lg")
# init skill extractor
skill_extractor = SkillExtractor(nlp, SKILL_DB, PhraseMatcher)
#-----------------------------------------------------
# app = Flask(__name__)
# CORS(app)  # Initialize CORS
# Set up logging
logging.basicConfig(filename="logs/app.log", level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(message)s')
# Example logging usage
logging.info("Application started.")

app = Flask(__name__)
CORS(app)
#------------------------------------------------------
# Load the job embeddings
with open('job_embeddings.pickle', 'rb') as f:
    job_embeddings = pickle.load(f)

job_embeddings = list(job_embeddings.values())
job_embeddings = torch.tensor(job_embeddings)

# Check the shape of the loaded embeddings tensor
print("Shape of loaded job embeddings:", job_embeddings.shape)

df_2 = pd.read_csv("Cleaned_data+scrap (1).csv")
print(df_2.shape)
if torch.cuda.is_available():
    device = 'cuda'
else:
    device = 'cpu'
print(device)

# Load the pre-trained model
model = AutoModel.from_pretrained("MohammedDhiyaEddine/job-skill-sentence-transformer-tsdae").to(device)
tokenizer = AutoTokenizer.from_pretrained("MohammedDhiyaEddine/job-skill-sentence-transformer-tsdae")
#------------------------------------------------------
def clean_text(text):
    try:
        # Remove numbers, emails, and links
        cleaned_text = re.sub(r'\b[0-9]+\b', '', text)  # Remove numbers
        cleaned_text = re.sub(r'\S+@\S+', '', cleaned_text)  # Remove emails
        cleaned_text = re.sub(r'http\S+', '', cleaned_text)  # Remove links
        # Remove spaces and special characters using regex
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)  # Remove multiple spaces
        cleaned_text = re.sub(r'[^A-Za-z\s]', '', cleaned_text)  # Remove non-alphanumeric characters except spaces
        logging.info(f"Text cleaned successfully: {cleaned_text[:20]}...")
        return cleaned_text
    except Exception as e:
        logging.error(f"Error cleaning text: {str(e)}")
        return text


# Generate user embedding
def generate_user_embedding(cleaned_text):
    encoded_input = tokenizer(cleaned_text, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        output = model(**encoded_input)
    embeddings = output.last_hidden_state.mean(dim=1)  # Mean pooling to get sentence embedding
    return embeddings


# Generate cosine similarity matrix and merged DataFrame
# Generate cosine similarity matrix and merged DataFrame
def get_cosine_matrix(user_embedding):
    try:
        tensor1 = user_embedding
        tensor2 = job_embeddings

        permutations = itertools.product(tensor1, tensor2)

        Embedding_df = pd.DataFrame(permutations, columns=['tensor1', 'tensor2'])
        Embedding_df['Index'] = range(tensor2.shape[0])
        Embedding_df.set_index('Index', inplace=True)
        Embedding_df['cosine_similarity'] = np.zeros((Embedding_df.shape[0]))

        for i in range(math.ceil(Embedding_df.shape[0])):
            tensor1 = Embedding_df.iloc[i]['tensor1']
            tensor2 = Embedding_df.iloc[i]['tensor2']
            cosine_similarity_value = torch.cosine_similarity(tensor1.unsqueeze(0), tensor2.unsqueeze(0)).item()
            Embedding_df.at[i, 'cosine_similarity'] = cosine_similarity_value

        Embedding_df = Embedding_df.sort_values(by='cosine_similarity', ascending=False)
        logging.info("Cosine similarity matrix and merged DataFrame generated successfully.")
        merged_df = pd.merge(Embedding_df, df_2, on='Index').set_index('Index')

        return Embedding_df, merged_df
    except Exception as e:
        logging.error(f"Error generating cosine similarity matrix and merged DataFrame: {str(e)}")
        return None, None
#------------------------------------------------------

# Replace with your Firebase configuration details
firebaseConfig = {
    "apiKey": "AIzaSyB0FfnoVZgfBAMH4eGNHjRiQdEUUUTHF7Y",
    "authDomain": "login-b5ff1.firebaseapp.com",
    "projectId": "login-b5ff1",
    "storageBucket": "login-b5ff1.appspot.com",
    "messagingSenderId": "510270866649",
    "appId": "1:510270866649:web:9cb24812ea0febbea7eac8"
}

# Initialize the Firebase Admin SDK
cred = credentials.Certificate('login-b5ff1-firebase-adminsdk-6fcmv-7bffa6fb90.json')
firebase_admin.initialize_app(cred, firebaseConfig)


@app.route('/signin', methods=['POST'])
def firebase_signin():
    try:
        # Get the ID token from the client-side request
        id_token = request.json.get('idToken')

        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        # User is authenticated, you can create a session or perform other actions
        logging.info('User authenticated successfully')
        return jsonify({'message': 'User authenticated successfully'}), 200

    except auth.RevokedIdTokenError:
        # Handle revoked token error
        logging.error('Token has been revoked')
        return jsonify({'error': 'Token has been revoked'}), 401

    except auth.ExpiredIdTokenError:
        # Handle expired token error
        logging.error('Token has expired')
        return jsonify({'error': 'Token has expired'}), 401

    except Exception as e:
        # Handle other authentication errors
        logging.error(f'Authentication failed: {str(e)}')
        return jsonify({'error': 'Authentication failed'}), 401


#----------------------------------------------------------------------------


# Configure logging
logging.basicConfig(filename='logs/app.log', level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(message)s')

@app.route('/api/process-resume', methods=['POST'])
def process_resume():
    if request.method == 'POST':
        try:
            if 'resume' not in request.files:
                logging.error('No file uploaded')
                return jsonify({'error': 'No file uploaded'})

            resume_file = request.files['resume']
            if resume_file.filename == '':
                logging.error('No selected file')
                return jsonify({'error': 'No selected file'})

            # Extract text from the resume PDF using PyMuPDF
            pdf_reader = PyPDF2.PdfReader(resume_file)
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text().lower()
            logging.info('Text extracted from resume PDF')

            # Clean the extracted text
            text = clean_text(text)
            logging.info('Text cleaned successfully')

            # Annotate the cleaned text to extract skills
            annotations = skill_extractor.annotate(text)

            # Initialize an empty set to store unique extracted skills
            unique_extracted_skills = set()

            # Extract skills from full_matches
            for match in annotations['results']['full_matches']:
                unique_extracted_skills.add(match['doc_node_value'])

            # Extract skills from ngram_scored
            for scored_match in annotations['results']['ngram_scored']:
                unique_extracted_skills.add(scored_match['doc_node_value'])

            # Convert the set back to a list if needed
            unique_extracted_skills_list = list(unique_extracted_skills)

            # Join all unique extracted skills with commas
            comma_separated_unique_skills = ' '.join(unique_extracted_skills_list)

            logging.info('Skills extracted from resume')

            # Generate user embedding from the extracted skills
            user_embedding = generate_user_embedding(comma_separated_unique_skills)
            logging.info('User embedding generated successfully')

            # Generate cosine similarity matrix and merged DataFrame
            CosineMatrix, merged_df = get_cosine_matrix(user_embedding)
            logging.info('Cosine similarity matrix and merged DataFrame generated successfully')

            # Get top 10 job recommendations from the merged DataFrame
            top_10_recommendations = merged_df['Position'].head(10).tolist()
            logging.info('Top 10 job recommendations generated')

            return jsonify(message="Sentence embeddings generated successfully", jobRecommendations=top_10_recommendations)
        except Exception as e:
            logging.error(f'An error occurred: {str(e)}')
            return jsonify(error="An error occurred while processing the resume")
    else:
        logging.error('Invalid request method')
        return jsonify(error="Invalid request")

#----------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)