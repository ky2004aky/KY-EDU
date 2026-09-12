# KY EDU - Indian Career & Govt Exam Guidance Platform

A full-stack Indian Education, Career Stream Guidance & Sarkari Exam Gateway built with **PHP 8.2**, **React 18**, and **MongoDB 8.0**, featuring full CRUD operations, live circular updates, interactive eligibility calculators, and side-by-side exam comparisons.

---

## Key Features

1. **Govt Exams Directory (Sarkari Hub)**:
   - Comprehensive catalog of top central and state recruitments:
     - **UPSC**: Civil Services (IAS, IPS, IFS), NDA, CDS
     - **SSC**: CGL, CHSL (12th Pass), MTS (10th Pass)
     - **Banking**: IBPS PO/Clerk, SBI Clerk, RBI Grade B
     - **Railways**: RRB NTPC, RRB ALP/Technician
     - **Defense**: Indian Army, Navy, Air Force, AFCAT
     - **State PSCs**: UPPSC / UP PCS, BPSC, MPSC
     - **Engineering & PSUs**: GATE (IOCL, ONGC, NTPC, BHEL), ISRO ICRB Scientist
     - **Teaching**: UGC NET / JRF, CTET
   - Complete 7th Pay Commission pay matrix, in-hand projections, exam patterns, stage breakdowns, and syllabus focus.

2. **Interactive Eligibility Matcher**:
   - Students input **Age**, **Qualification Level** (10th, 12th, Diploma, Graduate, Post Graduate), **Stream**, and **Category Reservation** (Gen/EWS, OBC, SC, ST, PwD).
   - Dynamically evaluates category age relaxations (OBC +3y, SC/ST +5y, PwD +10y) and returns matched opportunities with percentage compatibility scores.

3. **Career Scopes & Educational Roadmaps**:
   - Structured roadmaps for **10th Pass**, **12th Science (PCM)**, **12th Science (PCB)**, **12th Commerce**, **12th Arts/Humanities**, and **Graduates**.
   - Details top entrance exams (JEE, NEET, CA Foundation, CLAT, PolyCET), degrees, starting packages, and corresponding government exam avenues.

4. **Complete CRUD Operations & "Apply Update"**:
   - **Create**: Add new government examinations with rich fields (vacancies, conducting bodies, dates, pay scales, syllabus).
   - **Read**: Fast search by exam title, authority, posts, category, and qualification.
   - **Update**: Edit existing exam specs with immediate MongoDB updates.
   - **Apply Update**: Specific action to publish an official circular (Admit Card Released, Exam Date Announced, Vacancies Revised) which appends to the exam's timeline and broadcasts to the live Sarkari alerts ticker.
   - **Delete**: Safely remove outdated recruitments.

5. **Exam Comparator Tool**:
   - Side-by-side comparative analysis of any two exams across age limits, vacancies, stages, 7th CPC salary, and perks.

---

## Tech Stack

- **Backend**: PHP 8.2 REST API with native `mongodb` extension (`MongoDB\Driver\Manager`, `MongoDB\Driver\BulkWrite`, `MongoDB\Driver\Query`).
- **Database**: MongoDB 8.0 (`ky_edu_db` database, `exams`, `careers`, `updates` collections).
- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React Icons.

---

## Running the Application

### 1. Start MongoDB
Ensure the MongoDB service is running on `localhost:27017` (default Windows Service).

### 2. Start PHP Backend API
From the root project directory:
```bash
php -S localhost:8000 -t backend
```
Backend API will be live at `http://localhost:8000`.

### 3. Start React Frontend
From the `frontend` directory:
```bash
cd frontend
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/exams.php` | List exams with search, category, qualification & status filters |
| `GET` | `/api/exams.php?id={id}` | Get single exam details |
| `POST` | `/api/exams.php` | **Create** a new government exam |
| `PUT` | `/api/exams.php?id={id}` | **Update** exam specifications |
| `PUT` | `/api/exams.php?id={id}&action=apply_update` | **Apply Update** (notice, date, admit card, status) |
| `DELETE` | `/api/exams.php?id={id}` | **Delete** an exam from MongoDB |
| `GET` | `/api/careers.php` | Get career stream roadmaps |
| `POST` | `/api/careers.php` | Add a new career pathway |
| `GET` | `/api/updates.php` | Fetch live Sarkari notices |
| `POST` | `/api/eligibility.php` | Calculate user eligibility against all exams |
| `GET` | `/api/stats.php` | Return system metrics and counts |
| `GET` | `/api/seed.php` | Populate authentic initial Indian exam dataset |

---

## Authors & Verification
Built for Indian students and government exam aspirants. Verified with automated end-to-end CRUD test suites (`backend/test_crud.php` and HTTP integration tests).
