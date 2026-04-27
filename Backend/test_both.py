import requests

url = "http://127.0.0.1:8000/recommend"

print("--- Testing GET ---")
try:
    res_get = requests.get(url, params={"query": "Data Analyst", "k": 2})
    print(f"GET Status: {res_get.status_code}")
    print(f"GET Response: {res_get.json()[:1]}") # print only first item
except Exception as e:
    print(f"GET Error: {e}")

print("\n--- Testing POST ---")
try:
    res_post = requests.post(url, json={"query": "Data Analyst", "top_n": 2})
    print(f"POST Status: {res_post.status_code}")
    print(f"POST Response: {res_post.json()}")
except Exception as e:
    print(f"POST Error: {e}")
