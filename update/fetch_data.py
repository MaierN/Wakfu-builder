
import urllib.request
import urllib.parse
import sys
import io

DIRECTORY = "data/raw_content"

if len(sys.argv) < 3:
    print("Missing parameter(s)")
    exit()

def fetch_content(page):
    print("Fetching from www.wakfu.com, page " + page + "...")

    url = 'https://www.wakfu.com/fr/mmorpg/encyclopedie/armures?size=96&page=' + page
    
    headers = {}

    headers_raw = """Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate, br
Accept-Language: fr-CH,fr;q=0.9,en-US;q=0.8,en;q=0.7,fr-FR;q=0.6,de;q=0.5
Cache-Control: no-cache
Connection: keep-alive
Cookie: __cfduid=db3f19b4af0a8c942739219bffec420621565716877; __cfruid=1bce338b4202af1a3fe83dddbc593811c58d7814-1565716878; SID=07457E0088A6D6EF64917B188F290000; WKDSH=1; PRIV={"v1":{"fbtr":{"c":"y","ttl":18521},"ggan":{"c":"y","ttl":18521},"otad":{"c":"y","ttl":18521},"fbok":{"c":"y","ttl":18521},"ggpl":{"c":"y","ttl":18521},"twtr":{"c":"y","ttl":18521},"dsrd":{"c":"y","ttl":18521},"pwro":{"c":"y","ttl":18521},"ytbe":{"c":"y","ttl":18521},"twch":{"c":"y","ttl":18521},"gphy":{"c":"y","ttl":18521},"ggmp":{"c":"y","ttl":18521}}}; CNIL=1; _ga=GA1.1.384445203.1565716894; _gid=GA1.1.1832638659.1565716894; _fbp=fb.1.1565716893910.2106789389; size=5000; LANG=fr; _gat=1
Host: www.wakfu.com
Pragma: no-cache
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"""

    for line in headers_raw.splitlines():
        separator = line.find(": ")
        headers[line[:separator]] = line[separator+2:]

    del headers["Accept-Encoding"]

    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')

        f = io.open(DIRECTORY + "/raw_content_" + page.zfill(4) + ".html", "w", encoding='utf-8')
        f.write(content)
        f.close()

        print("Done fetching!")

for i in range(int(sys.argv[1]), int(sys.argv[2])+1):
    fetch_content(str(i))
