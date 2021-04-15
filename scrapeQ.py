import sys
from subprocess import Popen, PIPE
import selenium
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')


path = "C:\Program Files (x86)\chromedriver.exe"
driver = webdriver.Chrome(path, options=options)

#print('query: https://www.youtube.com/results?search_query='+str(sys.argv[1]))

driver.get('https://www.youtube.com/results?search_query='+str(sys.argv[1]))

#searchTitle = driver.find_element_by_id("video-title")
#print(searchTitle.text)

ids = driver.find_elements_by_xpath('//*[@id]')
for ii in ids:
    if ii == 'video-title':
        t = driver.find_element_by_id(ii)
        print(t.text)
        print('hi')

titles_unorganized = driver.find_elements_by_class_name('ytd-video-renderer')
links_unorganized = driver.find_elements_by_class_name('ytd-thumbnail')

links = []

# titles = []
# for x in titles_unorganized:
#     if x not in titles:
#         try:
#             print(x.text)
#             sys.stdout.flush()
#             titles.append(x.text)
#         except Exception as e:
#             print('Error loading title: ' + e)
#         finally:
#             continue


#[titles.append(x.text) for x in titles_unorganized if x not in titles]


# for i in range(0, len(titles)):
#     sys.stdout.flush()
#     try:
#         print(titles[i])
#         sys.stdout.flush()
#     except Exception as e:
#         print('Error loading titles: '+e)
#     finally:
#         continue


for link in links_unorganized:
    if link.get_attribute("href") == None or link.get_attribute("href") == 'None':
        pass
    else:
        try:
            print(link.get_attribute("href"))
            sys.stdout.flush()
            links.append(link.get_attribute("href"))
        except Exception as e:
            print("Error getting link: "+str(e))


for i in range(0, (len(links)-1)):
    try:
        driver.get(str(links[i]))
        get_title = driver.title
        print(get_title)
        sys.stdout.flush()
    except Exception as e:
        print("Error printing title: "+ str(e))

driver.quit()
