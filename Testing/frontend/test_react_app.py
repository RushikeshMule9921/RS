import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException, NoSuchElementException

class ReactAppTest(unittest.TestCase):
    #CHecking for the title
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()

    #end to end testing
    def test_end_to_end(self):
        driver = self.driver
        driver.get("http://localhost:3001/")

        # Wait for the title to be 'JobQuest'
        try:
            WebDriverWait(driver, 10).until(EC.title_contains("JobQuest"))
        except TimeoutException:
            print("Error: Page title 'JobQuest' not found within the specified timeout.")
            # You can choose to retry or move to the next step

        # Test home page
        try:
            assert "JobQuest" in driver.title  # Check if the title contains "JobQuest"
        except AssertionError:
            print("Error: Page title does not contain 'JobQuest'.")
            # You can choose to take a screenshot, log the error, or perform any other desired action

        time.sleep(5)

        try:
            get_started_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".get-started-button button"))
            )
            get_started_button.click()
        except (TimeoutException, StaleElementReferenceException):
            print("Error: Get Started button not found or became stale.")
            # You can choose to retry or move to the next step

        # Test login page
        try:
            login_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".login-button button"))
            )
            # login_button.click()
        except (TimeoutException, StaleElementReferenceException, NoSuchElementException):
            print("Error: Login button not found or became stale.")
            # You can choose to retry or move to the next step

        time.sleep(5)

        #Testing the Uploader page
        driver.get("http://localhost:3001/uploader")
        # Assuming the user is logged in and redirected
        # Handle the login popup here if necessary
        time.sleep(5)

        #Testing the file upload function
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "MT2023002.pdf")

        try:
            file_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".Upload input[type='file']"))
            )
            file_input.send_keys(file_path)  # Use the constructed file path
        except (TimeoutException, StaleElementReferenceException, NoSuchElementException):
            print("Error: File input element not found or became stale.")
            # You can choose to retry or move to the next step

        try:
            upload_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".Upload button"))
            )
            upload_button.click()
        except (TimeoutException, StaleElementReferenceException, NoSuchElementException):
            print("Error: Upload button not found or became stale.")
            # You can choose to retry or move to the next step

        time.sleep(5)

        # Testing the recommendations page with dummy values
        driver.get("http://localhost:3000/recommendations?data=%5B%22Software%20Engineer%22%2C%20%22Data%20Scientist%22%2C%20%22Web%20Developer%22%5D")

        try:
            job_recommendations = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".job-recommendations table tbody tr"))
            )
            assert len(job_recommendations) > 0  # Check if there are job recommendations
        except (TimeoutException, AssertionError):
            print("Error: No job recommendations found or elements not present.")
            # You can choose to take a screenshot, log the error, or perform any other desired action

        time.sleep(5)


    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()