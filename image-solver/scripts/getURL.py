import requests
from bs4 import BeautifulSoup

# URL of the page to scrape
url = "https://www.drsloth.com/search/?category=18&width=450&height=150"

# Send a GET request to the URL
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    print("Successfully accessed the page.")
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
    exit()

# Parse the page content
soup = BeautifulSoup(response.content, 'html.parser')

# Find the specific <ul> element
ul_element = soup.find('ul', class_='no-padding small-block-grid-2 large-block-grid-4 text-center')

# Debugging: Print the found element
if ul_element:
    print("Found the <ul> element.")
else:
    print("Could not find the <ul> element. Check the class names.")

# Find and extract the <img> URLs
images = []
if ul_element:
    for li in ul_element.find_all('li'):
        img = li.find('img')
        if img and img.get('src'):
            images.append(img['src'])

# Save the list of image URLs to a text file
with open('image_urls.txt', 'w') as file:
    for img_url in images:
        file.write(f"{img_url}\n")  # Write each URL on a new line

# Print the result
if images:
    print(f"Saved {len(images)} image URLs to 'image_urls.txt'.")
else:
    print("Saved 0 image URLs to 'image_urls.txt'.")
