import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print(f"Testing SmartKoach Integration API at {BASE_URL}...")
    
    # Check if backend is running
    try:
        health_check = requests.get(f"{BASE_URL}/")
        print(f"Health check: {health_check.status_code}")
        if health_check.status_code != 200:
            print("Error: Backend doesn't appear to be running correctly.")
            return False
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the backend. Is it running on port 8000?")
        return False

    print("\n1. Testing /reset endpoint...")
    reset_res = requests.post(f"{BASE_URL}/reset")
    print(f"Status: {reset_res.status_code}")
    print(f"Response: {reset_res.text}")

    print("\n2. Testing /chat endpoint...")
    payload = {
        "message": "Give me a medium-level DSA question on arrays.",
        "domain": "DSA",
        "difficulty": "Medium"
    }
    
    chat_res = requests.post(f"{BASE_URL}/chat", json=payload)
    print(f"Status: {chat_res.status_code}")
    
    if chat_res.status_code == 200:
        data = chat_res.json()
        print(f"\nAI Response:\n{data.get('reply', 'No reply field found')}")
        print("\nSUCCESS: API integration is working!")
        return True
    else:
        print(f"\nError Response:\n{chat_res.text}")
        print("\nFAILURE: API integration failed.")
        return False

if __name__ == "__main__":
    test_api()
