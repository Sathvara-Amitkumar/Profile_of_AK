"""Run:  python make_share_pages.py   (project root me, jab bhi naya post add karo)
posts.js padh ke har post ke liye p/<slug>.html banata hai (LinkedIn/WhatsApp preview ke liye)."""
import re, html, pathlib
SITE = "https://amitsathvara.netlify.app"
src = pathlib.Path("assets/js/posts.js").read_text(encoding="utf-8")
out = pathlib.Path("p"); out.mkdir(exist_ok=True)
for block in re.findall(r"\{[^{}]*?slug:[^{}]*?\}", src, re.S):
    g = lambda k: (re.search(k + r'\s*:\s*"((?:[^"\\]|\\.)*)"', block) or [None, ""])[1]
    slug, title, summ, cover, date = g("slug"), html.escape(g("title")), html.escape(g("summary")), g("cover"), g("date")
    url, img = f"{SITE}/p/{slug}.html", f"{SITE}/{cover}"
    (out / f"{slug}.html").write_text(f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>{title}</title>
<meta name="description" content="{summ}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Amitkumar Sathvara">
<meta property="og:title" content="{title}"><meta property="og:description" content="{summ}">
<meta property="og:image" content="{img}"><meta property="og:url" content="{url}">
<meta property="article:published_time" content="{date}"><meta property="article:author" content="Amitkumar Sathvara">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{summ}"><meta name="twitter:image" content="{img}">
<link rel="canonical" href="{SITE}/post.html?p={slug}">
<script>location.replace("../post.html?p={slug}")</script></head>
<body style="background:#04040f;color:#ccc;font-family:sans-serif;padding:2rem">
<p>Opening <a style="color:#a78bfa" href="../post.html?p={slug}">{title}</a>...</p></body></html>''', encoding="utf-8")
    print("created", out / f"{slug}.html")
