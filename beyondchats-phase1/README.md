# Beyondchats – Phase 1

## Project Overview

BeyondChats Phase 1 is a backend-focused Laravel project that demonstrates clean API design, hosted database integration, and real-world readiness. The system exposes REST APIs to store and retrieve articles scraped or ingested from external URLs. The backend is connected to a **hosted MySQL database on Railway**, proving production-like deployment capability.

This phase focuses on **foundation building**: API correctness, database reliability, and system structure.

---

## Tech Stack

* **Backend Framework:** Laravel 12
* **Language:** PHP 8.2
* **Database:** MySQL (Hosted on Railway)
* **ORM:** Eloquent
* **API Style:** REST
* **Environment:** Local development + Remote DB

---

## System Architecture

```
┌────────────┐        HTTP Requests        ┌────────────────────┐
│   Client   │  ───────────────────────▶ │  Laravel API Layer │
│ (Browser / │                            │  Controllers &     │
│  Postman)  │  ◀─────────────────────── │  Routes             │
└────────────┘        JSON Responses       └─────────┬──────────┘
                                                     │
                                                     │ Eloquent ORM
                                                     ▼
                                           ┌────────────────────┐
                                           │   MySQL Database   │
                                           │  (Railway Hosted) │
                                           └────────────────────┘
```

**Flow Explanation:**

1. Client sends API request (`/api/articles`)
2. Laravel routes forward request to controller
3. Controller interacts with MySQL via Eloquent
4. JSON response returned to client

---

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

---

## API Endpoints

### 1. Get All Articles

**GET** `/api/articles`

**Response (200):**

```json
[
  {
    "id": 1,
    "title": "Will AI Understand the Complexities of Patient Care?",
    "content": "Scraped content placeholder",
    "url": "https://beyondchats.com/blogs/..."
  }
]
```

---

### 2. Create New Article

**POST** `/api/articles`

**Request Body:**

```json
{
  "title": "Sample Article",
  "content": "Initial content",
  "url": "https://example.com/article"
}
```

**Response:** `201 Created`

---

## Environment Configuration

The application uses a hosted MySQL database provided by Railway.

```env
DB_CONNECTION=mysql
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=38376
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=********
```

---

## Key Highlights

* Hosted database (production-like setup)
* Clean REST API design
* Laravel best practices
* Migration-driven schema
* JSON-based communication

---

## Phase-1 Completion Status

✅ Database connected (Railway MySQL)
✅ API tested and working
✅ Data persisted remotely
✅ Ready for Phase-2 enhancements

---

## Author

**Md Adil Alam**
Software Engineer 1 (Backend)
Bitpastel Solution Private Limited
Focused on System Design & Scalable APIs
