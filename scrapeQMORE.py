import sys
from subprocess import Popen, PIPE
import selenium
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')


path = "C:\Program Files (x86)\chromedriver.exe"
driver = webdriver.Chrome(path, options=options)

driver.get('https://www.youtube.com/results?search_query='+str(sys.argv[1]))

SCROLL_PAUSE_TIME = 0.5

# Get scroll height
last_height = driver.execute_script("return document.body.scrollHeight")

print('INDEX:',sys.argv[2])
for i in range(0, int(sys.argv[2])):
    # Scroll down to bottom
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    # Wait to load page
    time.sleep(SCROLL_PAUSE_TIME)

    # Calculate new scroll height and compare with last scroll height
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    last_height = new_height

titles_unorganized = driver.find_elements_by_class_name('ytd-video-renderer')
links_unorganized = driver.find_elements_by_class_name('ytd-thumbnail')

links = []

for link in links_unorganized:
    if link.get_attribute("href") == None or link.get_attribute("href") == 'None':
        pass
    else:
        print(link.get_attribute("href"))
        sys.stdout.flush()
        links.append(link.get_attribute("href"))


for i in range(0, (len(links)-1)):
    driver.get(str(links[i]))
    get_title = driver.title
    print(get_title)
    sys.stdout.flush()

driver.quit()
