import unittest
from flask import Flask
from io import BytesIO
import PyPDF2
from app import app  # Import the Flask app

class TestProcessResume(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_process_resume(self):
        # Create a sample PDF file
        with open('Vikram_resume.pdf', 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            pdf_writer = PyPDF2.PdfWriter()
            pdf_writer.add_page(pdf_reader.pages[0])
            pdf_bytes = BytesIO()
            pdf_writer.write(pdf_bytes)
            pdf_bytes.seek(0)

        # Send a POST request with the PDF file to the /api/process-resume endpoint
        response = self.client.post('/api/process-resume', data={'resume': (pdf_bytes, 'Vikram_resume.pdf')})

        # Assert that the response has a 200 status code (successful)
        self.assertEqual(response.status_code, 200)

        # Assert that the response contains the expected message and job recommendations
        data = response.get_json()
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Sentence embeddings generated successfully')
        self.assertIn('jobRecommendations', data)
        self.assertIsInstance(data['jobRecommendations'], list)

if __name__ == '__main__':
    unittest.main()
