# BeyondChats – Full Stack Assignment

This repository contains the complete solution for the BeyondChats assignment, implemented as a **single monolithic project** covering **Phase 1, Phase 2, and Phase 3**.
The project demonstrates an end-to-end flow where blog articles are **scraped**, **stored**, **processed**, and **displayed** using Laravel, Node.js, and React.

---

## 🔄 Overall System Flow (Phase 1  Phase 2  Phase 3)
```
User / Reviewer
│
▼
Phase 1 – Laravel Backend
─────────────────────────
Start Laravel Project
│
▼
Run Scraper Command
php artisan scrape:beyondchats
│
▼
Fetch BeyondChats Blog Homepage
│
▼
Detect Last Blog Page
│
▼
Open Last Blog Page
│
▼
Extract Blog Articles
│
▼
Select Oldest 5 Articles
│
▼
Store Articles in MySQL
│
▼
Expose Articles via APIs
GET /api/articles
│
▼
─────────────────────────
Phase 2 – Node.js Automation
─────────────────────────
Fetch Articles from Laravel API
│
▼
Search Google using Article Title
│
▼
Collect Reference Article URLs
│
▼
Scrape Reference Content
│
▼
Attempt AI-based Content Enhancement
│
▼
Fallback if AI Fails
│
▼
Update Article via Laravel API
PUT /api/articles/{id}
│
▼
─────────────────────────
Phase 3 – React Frontend
─────────────────────────
Start React Application
│
▼
Fetch Articles from Laravel API
│
▼
Render Article List UI
│
▼
Display Original / Updated Content
│
▼
End User View
```


# Phase-1: Laravel Backend (Hosted at Railway)

### What this phase does
- Automatically detects the **last page** of BeyondChats blogs
- Scrapes the **5 oldest articles**
- Stores them in a MySQL database
- Exposes **CRUD APIs** with pagination


## ⚙️ Environment Setup

The application uses a hosted MySQL database provided by Railway.

```env
DB_CONNECTION=mysql
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=38376
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=********
```

## Database Design

### Articles Table

| Column Name | Type              | Description     |
| ----------- | ----------------- | --------------- |
| id          | bigint            | Primary key     |
| title       | string            | Article title   |
| content     | text              | Article content |
| author      | string (nullable) | Author name     |
| url         | string            | Source URL      |
| created_at  | timestamp         | Auto-managed    |
| updated_at  | timestamp         | Auto-managed    |


## Key Highlights

* Hosted database (production-like setup)
* Clean REST API design
* Laravel best practices
* Migration-driven schema
* JSON-based communication


### Phase-1: Local setup instructions.

```bash
cd beyondchats-phase1
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan scrape:beyondchats
php artisan serve
```

### Fetch Laravel Api
- Locally     : http://127.0.0.1:8000/api/articles/
- Hosted Url  : https://beyondchats.up.railway.app/api/articles



---



# Phase-2: Node.js Automation Script

This phase contains a **Node.js–based automation script** that processes articles stored in the Laravel backend.  
The script fetches articles from APIs, finds related content on Google, scrapes reference articles, and attempts to enhance the original article using LLMs with **safe fallback handling**.

---

## 🎯 Purpose of Phase 2

- Fetch articles from Laravel APIs
- Search Google for related articles
- Scrape content from external reference blogs
- Attempt AI-based article enhancement
- Update the article back using Laravel CRUD APIs
- Handle partial failures without breaking the flow

---

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
LARAVEL_API_BASE_URL=http://127.0.0.1:8000/api
GEMINI_API_KEY=*************************
LLM_PROVIDER=gemini
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### Error Handling

- If Google search fails → script exits safely
- If scraping fails → URL is skipped
- If AI API fails → original content is preserved
- Script never crashes due to external API failures


### NOTE
- Designed to work with free or limited APIs
- Modular structure for easy extension
- Safe fallback logic ensures data consistency


### Phase-2: Local setup instructions.

```bash
cd beyondchats-phase2
npm install
npm start
```


### Node will execute 
- Locally     : Run - node index.js
- Hosted Url  : https://beyondchatsscript.netlify.app/.netlify/functions/optimize





---




# Phase-3: React Frontend (Hosted at Netlify)

This phase contains a **ReactJS-based frontend application** that consumes the Laravel APIs and displays the articles in a **clean, responsive, and professional UI**.
The frontend is designed to show articles fetched from the backend and is structured to easily support both **original and updated versions** of articles.

---

## 🎯 Purpose of Phase 3

- Fetch articles from Laravel REST APIs
- Display articles in a user-friendly interface
- Provide a responsive layout suitable for desktop and mobile
- Serve as the **live demo** for reviewers

---


## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_BASE=http://127.0.0.1:8000/api
```

### API Dependency
- GET /api/articles
  

### Phase-3: Local setup instructions.

```bash
cd beyondchats-phase3
npm install
npm run dev

```

### React will open 
- Locally     : http://localhost:5173
- Hosted Url  : https://beyondchatsarticles.netlify.app/





## Author

**Md Adil Alam**







