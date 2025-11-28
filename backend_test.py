import requests
import sys
import time
import json
from datetime import datetime

class HangiFiltreAPITester:
    def __init__(self, base_url="https://retail-harvester.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.task_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test creating a status check
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            data={"client_name": "test_client"}
        )
        
        if not success:
            return False
            
        # Test getting status checks
        success, response = self.run_test(
            "Get Status Checks",
            "GET",
            "status",
            200
        )
        
        return success

    def test_scrape_start(self):
        """Test starting a scrape job"""
        test_url = "https://hangifiltre.com/kategori/bakim-setleri/"
        
        success, response = self.run_test(
            "Start Scraping",
            "POST",
            "scrape",
            200,
            data={"url": test_url},
            timeout=60
        )
        
        if success and 'task_id' in response:
            self.task_id = response['task_id']
            print(f"   Task ID: {self.task_id}")
            return True
        
        return False

    def test_scrape_status(self):
        """Test checking scrape status"""
        if not self.task_id:
            print("❌ No task ID available for status check")
            return False
            
        success, response = self.run_test(
            "Check Scrape Status",
            "GET",
            f"scrape/status/{self.task_id}",
            200
        )
        
        if success:
            status = response.get('status', 'unknown')
            progress = response.get('progress', 0)
            total_products = response.get('total_products', 0)
            print(f"   Status: {status}, Progress: {progress}%, Products: {total_products}")
        
        return success

    def wait_for_scrape_completion(self, max_wait_time=300):
        """Wait for scraping to complete"""
        if not self.task_id:
            print("❌ No task ID available")
            return False
            
        print(f"\n⏳ Waiting for scraping to complete (max {max_wait_time}s)...")
        start_time = time.time()
        
        while time.time() - start_time < max_wait_time:
            success, response = self.run_test(
                "Monitor Scrape Progress",
                "GET",
                f"scrape/status/{self.task_id}",
                200
            )
            
            if not success:
                return False
                
            status = response.get('status', 'unknown')
            progress = response.get('progress', 0)
            total_products = response.get('total_products', 0)
            
            print(f"   Status: {status}, Progress: {progress}%, Products: {total_products}")
            
            if status == "completed":
                print(f"✅ Scraping completed! Found {total_products} products")
                return True
            elif status == "failed":
                error = response.get('error', 'Unknown error')
                print(f"❌ Scraping failed: {error}")
                return False
                
            time.sleep(5)  # Wait 5 seconds before next check
        
        print(f"❌ Scraping did not complete within {max_wait_time} seconds")
        return False

    def test_excel_export(self):
        """Test Excel export functionality"""
        if not self.task_id:
            print("❌ No task ID available for Excel export")
            return False
            
        print(f"\n📊 Testing Excel export for task {self.task_id}...")
        
        try:
            url = f"{self.api_url}/export/excel/{self.task_id}"
            response = requests.get(url, timeout=60)
            
            if response.status_code == 200:
                # Check if response is Excel file
                content_type = response.headers.get('content-type', '')
                if 'spreadsheet' in content_type or 'excel' in content_type:
                    print(f"✅ Excel export successful - Content-Type: {content_type}")
                    print(f"   File size: {len(response.content)} bytes")
                    self.tests_passed += 1
                    return True
                else:
                    print(f"❌ Invalid content type: {content_type}")
            else:
                print(f"❌ Excel export failed - Status: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
            
            self.tests_run += 1
            return False
            
        except Exception as e:
            print(f"❌ Excel export error: {str(e)}")
            self.tests_run += 1
            return False

    def test_invalid_endpoints(self):
        """Test error handling for invalid requests"""
        # Test invalid task ID
        success, response = self.run_test(
            "Invalid Task ID Status Check",
            "GET",
            "scrape/status/invalid-task-id",
            404
        )
        
        # Test scrape without URL
        success2, response2 = self.run_test(
            "Scrape Without URL",
            "POST",
            "scrape",
            422,  # Validation error
            data={}
        )
        
        return success and success2

def main():
    print("🚀 Starting HangiFiltre API Tests")
    print("=" * 50)
    
    tester = HangiFiltreAPITester()
    
    # Test basic endpoints
    if not tester.test_root_endpoint():
        print("❌ Root endpoint failed, stopping tests")
        return 1
    
    if not tester.test_status_endpoints():
        print("❌ Status endpoints failed, stopping tests")
        return 1
    
    # Test scraping workflow
    if not tester.test_scrape_start():
        print("❌ Scrape start failed, stopping tests")
        return 1
    
    # Monitor scraping progress
    if not tester.wait_for_scrape_completion():
        print("❌ Scraping did not complete successfully")
        return 1
    
    # Test Excel export
    if not tester.test_excel_export():
        print("❌ Excel export failed")
        return 1
    
    # Test error handling
    if not tester.test_invalid_endpoints():
        print("⚠️ Error handling tests failed")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())