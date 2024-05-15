from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import auth, credentials

app = Flask(__name__)
CORS(app)  # Initialize CORS

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
    # Get the ID token from the client-side request
    id_token = request.json.get('idToken')

    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        # User is authenticated, you can create a session or perform other actions
        # ...
        return jsonify({'message': 'User authenticated successfully'}), 200
    except auth.RevokedIdTokenError:
        # Handle revoked token error
        return jsonify({'error': 'Token has been revoked'}), 401
    except auth.ExpiredIdTokenError:
        # Handle expired token error
        return jsonify({'error': 'Token has expired'}), 401
    except Exception as e:
        # Handle other authentication errors
        print(e)
        return jsonify({'error': 'Authentication failed'}), 401

if __name__ == '__main__':
    app.run()