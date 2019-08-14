
import sys
import io
import re
from xml.dom import minidom
import html
import os
import json

DIRECTORY = "data/raw_content"
OUTPUT_FILE = "data/item_data.js"


def read_file(filename):
    f = io.open(filename, "r", encoding="utf-8")
    html_content = f.read()
    f.close()

    html_content = html.unescape(html_content)
    table_re = re.compile("<tbody.*</tbody>", re.MULTILINE | re.DOTALL)
    table_str = "".join(table_re.findall(html_content))

    test = io.open("test.html", "w", encoding="utf-8")
    test.write(table_str)
    test.close()

    lines = table_str.splitlines()

    problem = False
    while problem:
        problem = False
        for index, line in enumerate(lines):
            if "data-role" in line:
                print("File " + filename + ", eliminating line " + str(index) + ": " + line)
                problem = True

                for i in range(15, -5, -1):
                    lines.pop(index + i)

                break

    return "\n".join(line for line in lines)


def get_first_number(string):
    re_first_number = re.compile('^-?[0-9]+')
    res = re_first_number.findall(string)
    return res[0] if res else ""


def get_last_number(string):
    re_last_number = re.compile('[0-9]+$')
    res = re_last_number.findall(string)
    return res[len(res)-1]

def extract_id(string):
    re_id = re.compile('id":"[0-9]+')
    res = re_id.findall(string)
    return get_last_number("".join(res))

def parse_items(html_content, items):
    dom = minidom.parseString(html_content)

    for tr in dom.getElementsByTagName("tr"):
        item = {
            "item_id": extract_id(tr.getElementsByTagName("td")[0].getElementsByTagName("script")[0].firstChild.nodeValue),
            "item_img": tr.getElementsByTagName("td")[0].getElementsByTagName("img")[0].getAttribute("src"),

            "rarity": int(get_last_number(tr.getElementsByTagName("td")[1].getElementsByTagName("span")[0].getAttribute("class"))),
            "item_link": "https://www.wakfu.com" + tr.getElementsByTagName("td")[1].getElementsByTagName("span")[1].getElementsByTagName("a")[0].getAttribute("href"),
            "name": tr.getElementsByTagName("td")[1].getElementsByTagName("span")[1].getElementsByTagName("a")[0].firstChild.nodeValue,

            "type": tr.getElementsByTagName("td")[2].getElementsByTagName("img")[0].getAttribute("title"),
            "type_img": tr.getElementsByTagName("td")[2].getElementsByTagName("img")[0].getAttribute("src"),

            "level": int(get_last_number(tr.getElementsByTagName("td")[4].firstChild.nodeValue)),

            "bonuses": {},
            "bonuses_raw": [],
        }

        for div in tr.getElementsByTagName("td")[3].getElementsByTagName("div"):
            if div.getAttribute("class") == "ak-title":
                bonus_str = div.firstChild.nodeValue.strip()

                if bonus_str == "":
                    bonus_str = "1 Bonus spécial"
                
                while bonus_str.find("  ") >= 0:
                    bonus_str = bonus_str.replace("  ", " ")

                item["bonuses_raw"].append(bonus_str)
                    
                value = get_first_number(bonus_str)
                
                if "Résistance" in bonus_str: # or "Résistance Air" in bonus_str or "Résistance Eau" in bonus_str or "Résistance Feu" in bonus_str or "Résistance Terre" in bonus_str or "Résistance [" in bonus_str or "Résistance sur " in bonus_str or "Résistance Élémentaire" in bonus_str:
                    bonus_str = value + " Résistance [...]"

                if "Maîtrise Air" in bonus_str or "Maîtrise Eau" in bonus_str or "Maîtrise Feu" in bonus_str or "Maîtrise Terre" in bonus_str or "Maîtrise [" in bonus_str or "Maîtrise sur " in bonus_str or "Maîtrise Élémentaire" in bonus_str:
                    bonus_str = value + " Maîtrise élém."

                if "PW" in bonus_str:
                    bonus_str = value + " PW"
                if "PA" in bonus_str:
                    bonus_str = value + " PA"
                if "PM" in bonus_str:
                    bonus_str = value + " PM"

                if "Niv. aux sorts" in bonus_str:
                    bonus_str = value + " Niv. aux sorts"

                item["bonuses"][bonus_str[len(value):].strip()] = int(value)

        items.append(item)


items = []

for filename in os.listdir(DIRECTORY):
    print("Parsing file " + filename + "...")
    html_content = read_file(DIRECTORY + "/" + filename)
    parse_items(html_content, items)
    print("Done parsing!")

print("Sorting data...")
items = sorted(
    items, key=lambda item: item["level"]*10+item["rarity"], reverse=True)
print("Done sorting!")


print("Writing output...")
output_f = io.open(OUTPUT_FILE, "w", encoding='utf-8')
output_f.write("item_data = ")
output_f.write(json.dumps(items, indent=4))
output_f.close()
print("Done writing!")
