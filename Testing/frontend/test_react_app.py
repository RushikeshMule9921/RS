import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class ReactAppTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()

    def test_end_to_end(self):
        driver = self.driver
        driver.get("http://localhost:3001/")

        # Wait for the title to be 'JobQuest'
        WebDriverWait(driver, 10).until(EC.title_contains("JobQuest"))

        # Test home page
        assert "JobQuest" in driver.title  # Check if the title contains "JobQuest"
        time.sleep(5)
        get_started_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".get-started-button button"))
        )
        get_started_button.click()

        # Test login page
        login_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".login-button button"))
        )
        # login_button.click()

        driver.get("http://localhost:3001/uploader")
        # Assuming the user is logged in and redirected
        # Handle the login popup here if necessary
        time.sleep(5)

        # Test uploader page
        # Construct the file path relative to this script's directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "MT2023002.pdf")

        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".Upload input[type='file']"))
        )
        file_input.send_keys(file_path)  # Use the constructed file path
        upload_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".Upload button"))
        )
        upload_button.click()
        time.sleep(5)
        # Test recommendations page
        driver.get("http://localhost:3000/recommendations?data=%5B%22Software%20Engineer%22%2C%20%22Data%20Scientist%22%2C%20%22Web%20Developer%22%5D")
        job_recommendations = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".job-recommendations table tbody tr"))
        )
        assert len(job_recommendations) > 0  # Check if there are job recommendations
        time.sleep(5)
    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()
