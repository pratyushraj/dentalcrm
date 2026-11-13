import urllib.request
import re

url = "https://www.flexmoney.in/assets/FAQ-D21Ql3OU.js"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    text = resp.read().decode("utf-8", errors="ignore")

# Write raw text to inspect
with open("flexmoney_faq_raw.js", "w", encoding="utf-8") as f:
    f.write(text)

# Regex to find questions and answers
pattern = re.compile(r'question:\s*["\'](.*?)["\'],\s*answer:\s*["\'](.*?)["\']', re.DOTALL)
matches = pattern.findall(text)

print(f"Extracted {len(matches)} FAQs:")
for idx, (q, a) in enumerate(matches, 1):
    print(f"\n[{idx}] QUESTION: {q}")
    print(f"ANSWER: {a}")
