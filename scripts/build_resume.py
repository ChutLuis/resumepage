#!/usr/bin/env python3
"""Generate Luis Ortiz resume PDF (serif, LaTeX-like) with LinkedIn instead of phone."""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import black, HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

LINKEDIN_URL = "https://www.linkedin.com/in/luis-ortiz-3b5454195/"
EMAIL = "me@lfortiz.com"

PAGE_W, PAGE_H = letter
LM, RM = 0.9 * inch, 0.9 * inch
CONTENT_W = PAGE_W - LM - RM

SERIF = "Times-Roman"
SERIF_B = "Times-Bold"
SERIF_I = "Times-Italic"

c = canvas.Canvas("public/resume.pdf", pagesize=letter)
c.setTitle("Luis Ortiz - Resume")
c.setAuthor("Luis Ortiz")

y = PAGE_H - 0.7 * inch


def center(text, font, size, yy, link=None):
    w = stringWidth(text, font, size)
    x = (PAGE_W - w) / 2
    c.setFont(font, size)
    c.drawString(x, yy, text)
    if link:
        c.linkURL(link, (x, yy - 1, x + w, yy + size), relative=0)


# Name
center("LUIS ORTIZ", SERIF, 26, y)
y -= 20

# Contact line: LinkedIn | email | location
c.setFont(SERIF, 10.5)
parts = ["LinkedIn", " | ", EMAIL, " | ", "Guatemala City, Guatemala, CA."]
fonts = [SERIF, SERIF, SERIF, SERIF, SERIF]
total = sum(stringWidth(p, SERIF, 10.5) for p in parts)
x = (PAGE_W - total) / 2
link_rects = {}
for p in parts:
    w = stringWidth(p, SERIF, 10.5)
    c.drawString(x, y, p)
    if p == "LinkedIn":
        c.linkURL(LINKEDIN_URL, (x, y - 1, x + w, y + 10.5), relative=0)
    elif p == EMAIL:
        c.linkURL("mailto:" + EMAIL, (x, y - 1, x + w, y + 10.5), relative=0)
    x += w
y -= 22


def section(title):
    global y
    c.setFont(SERIF, 13)
    c.drawString(LM, y, title.upper())
    y -= 5
    c.setLineWidth(0.6)
    c.line(LM, y, PAGE_W - RM, y)
    y -= 15


def para(text, size=10.5, font=SERIF, indent=0, gap=3):
    global y
    max_w = CONTENT_W - indent
    words = text.split()
    line = ""
    for word in words:
        test = (line + " " + word).strip()
        if stringWidth(test, font, size) <= max_w:
            line = test
        else:
            c.setFont(font, size)
            c.drawString(LM + indent, y, line)
            y -= size + 2
            line = word
    if line:
        c.setFont(font, size)
        c.drawString(LM + indent, y, line)
        y -= size + 2
    y -= gap


def bullet(text, size=10.5):
    global y
    bx = LM + 18
    max_w = CONTENT_W - 18 - 8
    c.setFont(SERIF, size)
    c.drawString(bx - 10, y, "•")
    words = text.split()
    line = ""
    first = True
    for word in words:
        test = (line + " " + word).strip()
        if stringWidth(test, size and SERIF or SERIF, size) <= max_w:
            line = test
        else:
            c.drawString(bx, y, line)
            y -= size + 2
            line = word
    if line:
        c.drawString(bx, y, line)
        y -= size + 2
    y -= 1


def job(title, dates, company):
    global y
    c.setFont(SERIF_B, 11)
    c.drawString(LM + 8, y, title)
    c.setFont(SERIF, 10)
    dw = stringWidth(dates, SERIF, 10)
    c.drawString(PAGE_W - RM - dw, y, dates)
    y -= 12
    c.setFont(SERIF_I, 10)
    c.drawString(LM + 8, y, company)
    y -= 14


# ---- Professional Summary ----
section("Professional Summary")
para("A full-stack developer and UI/UX designer who partners with businesses to build custom web "
     "applications from concept to launch. Specializing in creating engaging user experiences with "
     "modern technologies like React, NestJS, and Web AR. Proven ability to deliver robust, innovative, "
     "and user-centered solutions that drive business results.", gap=6)

# ---- Professional Experience ----
section("Professional Experience")

job("Senior Applications Developer", "October 2024 - Present", "TELUS Digital Solutions")
bullet("Core engineer on TELUS's flagship customer-facing React Native app; deliver features across billing, notifications, navigation, and platform infrastructure.")
bullet("Led the design and delivery of a new in-app customer experience end-to-end — from feature detection logic to composed UI — shipped dark behind Firebase Remote Config flags with a full regression test suite for zero-risk rollout.")
bullet("Owned cross-cutting platform concerns: the shared WebView layer, Salesforce Marketing Cloud SDK integration in an Expo app, Dynatrace error observability, and WCAG accessibility improvements across billing flows.")
y -= 2

job("Fullstack Engineer", "Sept 2024 - October 2024", "Hidden Mountain Data")
bullet("As a key contractor on an LLM project, rapidly developed and delivered a full-stack internal tool using Vue.js and NestJS within a tight deadline.")
bullet("Engineered the backend system, including the database schema with Prisma and PostgreSQL, enabling efficient data processing for the language model.")
y -= 2

job("Software Engineer", "May 2023 - Jun 2024", "Holland Orchids")
bullet("Led the full lifecycle of a new internal software suite, from initial UI/UX prototypes in Figma to full-stack development and deployment, which replaced an outdated legacy tool.")
bullet("Improved the stability and performance of existing React legacy systems and managed their on-premises server infrastructure.")
y -= 2

job("Web Dev", "March 2021 - May 2023", "Adslivemedia Corp.")
bullet("Developed and deployed multiple full-stack client websites using React, Vue, and Node.js.")
bullet("Managed all aspects of cloud infrastructure on AWS, including service deployment, monitoring, and administration.")
bullet("Pioneered the company’s Web Augmented Reality offerings by building interactive experiences with A-Frame and Three.js, leading to increased client engagement.")
y -= 6

# ---- Education ----
section("Education")
c.setFont(SERIF_B, 11)
c.drawString(LM + 8, y, "Universidad Rafael Landivar")
dw = stringWidth("2016 - 2023", SERIF, 10)
c.setFont(SERIF, 10)
c.drawString(PAGE_W - RM - dw, y, "2016 - 2023")
y -= 12
c.setFont(SERIF_I, 10)
c.drawString(LM + 8, y, "Bachelor of Engineering in Computers and Systems")
y -= 15

# ---- Skills ----
section("Skills & Proficiencies")
skills = [
    ("Key Technologies:", " Javascript, Typescript, React, Nest, Express, Postgres, mySQL."),
    ("UI/UX Design:", " Skilled in user experience and interface design with practical experience using Figma."),
    ("Cloud Platforms:", " Proficient in AWS for service deployment and monitoring."),
    ("Soft Skills:", " Problem Solving, Quick Learner, Time Management, Communication."),
    ("Software Security:", " Knowledge of best practices in security for software development."),
    ("Web Development:", " Responsive and mobile-first web design."),
    ("Data:", " Data analysis and visualization."),
]
for label, rest in skills:
    c.setFont(SERIF_B, 10.5)
    c.drawString(LM + 8, y, label)
    lw = stringWidth(label, SERIF_B, 10.5)
    c.setFont(SERIF, 10.5)
    c.drawString(LM + 8 + lw, y, rest)
    y -= 15

y -= 2
# ---- Languages ----
section("Languages")
c.setFont(SERIF, 10.5)
c.drawString(LM + 8, y, "American English (C2)")
y -= 14
c.drawString(LM + 8, y, "Spanish (Native)")

c.showPage()
c.save()
print("Resume written to public/resume.pdf")
