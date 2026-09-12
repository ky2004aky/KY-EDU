# PROJECT REPORT ON
# KY EDU: Indian Career Stream Guidance & Sarkari Examination Gateway

---

### Project Details

| Parameter | Details |
| :--- | :--- |
| **Project Title** | **KY EDU - Indian Career Stream Guidance & Sarkari Examination Gateway** |
| **Academic Year** | 2025 - 2026 |
| **Frontend** | React 18/19, Vite, Tailwind CSS, Lucide React Icons |
| **Backend** | PHP 8.2 (RESTful API, Token-based Security) |
| **Database** | MongoDB 8.0 (NoSQL Document Store, BSON) |
| **Server / Environment** | PHP Built-in Server (Port 8000) & Vite Server (Port 5173) |
| **Operating System** | Windows 10 / 11 / Linux Compatible |
| **Platform** | Node.js Runtime & PHP CLI Engine |
| **Documentation Format** | Standard Academic Project Report Specification |

---

## 1. Introduction

### 1.1 Project Description: -
➢ In today’s competitive education and employment landscape, Indian students face immense confusion and difficulty in identifying the right government examinations and career roadmaps matching their specific academic qualifications.
➢ After completing 10th, 12th (Science, Commerce, Arts), ITI, Polytechnic Diploma, B.Tech, B.Sc Agriculture, Law (LL.B), or Nursing, millions of aspirants do not know which Central and State Government vacancies they are legally eligible for.
➢ Existing examination notification portals are heavily cluttered with intrusive advertisements, misleading clickbait links, outdated eligibility criteria, and zero personalized guidance.
➢ **“KY EDU” (Know Your Education)** is an advanced, high-performance, web-based educational guidance and examination discovery platform engineered to solve these critical problems.
➢ It provides a Flipkart-style clean, ad-free, intuitive interface where aspirants can discover verified recruitments, calculate their personalized eligibility, inspect high-yield syllabus weightage, and access authoritative book recommendations.
➢ The system also features a dedicated, token-protected **Admin Portal** for educational administrators to publish official circulars, manage exam specifications, and track student department registrations.

---

### 1.2 Literature Review / Existing System: -
➢ Currently, several platforms such as Sarkari Result, FreeJobAlert, Testbook, and Adda247 provide recruitment notifications. However, these platforms suffer from significant limitations that hinder student productivity and decision-making.

#### Limitations of Existing Systems:
➢ **Excessive Advertisement Clutter**: Most legacy portals display 10+ banner advertisements per page, causing slow load times and deceptive download links.
➢ **No Academic Field / Stream Filtering**: Existing sites dump thousands of notifications in flat chronological order, making it nearly impossible for a B.Sc Agriculture, ITI, or Law student to filter only their relevant exams.
➢ **Lack of Eligibility Precision**: Generic portals fail to evaluate relaxation rules (OBC/SC/ST/PwD), appearing vs completed graduation rules, and minimum qualifying marks.
➢ **No High-Yield Booklists or Syllabus Breakdown**: Students are forced to wander across YouTube or telegram channels to find authoritative preparation books (e.g., M. Laxmikanth, RS Aggarwal, Spectrum).
➢ **Security Vulnerabilities**: Legacy PHP portals frequently lack structured token protection and input sanitation on mutating endpoints.

---

#### Proposed Solution by KY EDU:
➢ **Flipkart-Signature Clean White Interface**: Built with modern Tailwind CSS offering high readability, zero advertisements, and lightning-fast responsiveness.
➢ **Dual-Layer Multi-Field Filtering**: Provides 10 Board Categories (UPSC, SSC, Banking, Railways, Defense, State PSC, etc.) and 12 Academic Stream Filters (PCM, Commerce, Agriculture, ITI, B.Tech, Law, Nursing, etc.) with 100% zero-failure matching.
➢ **Intelligent Multi-Factor Eligibility Engine**: Evaluates candidate Age, Qualification, Passing Status, Percentage, and Category reservation according to official Gazette norms.
➢ **Deep Subject Details & Booklists**: Offers comprehensive syllabus percentages, key scoring chapters, and authoritative Indian book titles for every recruitment.
➢ **Protected Admin Portal**: Employs Bearer token authentication, 6-digit administrative PIN protection, and anti-tampering security on all CRUD operations.

---

### Project Specification Overview:

| Feature | Specification |
| :--- | :--- |
| **Project Title** | KY EDU (Know Your Education & Govt Exam Gateway) |
| **Frontend Technologies** | React.js 18/19, Vite, Tailwind CSS, Lucide Icons |
| **Backend Technologies** | PHP 8.2 (Object-Oriented, RESTful Endpoints) |
| **Database Management** | MongoDB 8.0 (`ky_edu_db`) |
| **API Architecture** | JSON REST API with CORS Middleware |
| **Run Environment** | `http://localhost:5173` (Frontend) & `http://localhost:8000` (Backend) |
| **Documentation Tool** | Markdown & Microsoft Word Academic Template |
| **Administrative Access** | PIN Protected (`123456`) & Role-Based Token Validation |

---

### 1.3 Objectives: -
➢ **To develop an authoritative, ad-free online platform** for Indian career pathways and government examination guidance.
➢ **To make the discovery system intuitive and user-friendly** through an e-commerce-inspired Flipkart aesthetic with instant search and auto-suggestions.
➢ **To eliminate student anxiety and confusion** by providing verified 7th CPC salary scales, physical criteria, and vacancy details directly from official gazettes.
➢ **To deliver a smart Eligibility Matcher** that prevents candidates from filling incorrect application forms.
➢ **To maintain comprehensive data roadmaps** for non-traditional academic streams including ITI Trades, Polytechnic Diplomas, Agriculture, Nursing, and Law.
➢ **To provide isolated, secure Admin and Student user panels** to maintain data integrity and prevent unauthorized modifications.

---

### 1.4 Proposed System: -
➢ The proposed system **“KY EDU”** provides:

➢ **Two Distinct Operational Panels**:
* **Student Aspirant Panel**: Allows users to search examinations with live auto-suggestions, calculate age and qualification eligibility, view recommended booklists, compare examinations side-by-side, explore career roadmaps, and save their study profile.
* **Administrative Management Panel**: Secure gateway allowing administrators to create, update, and delete exam records, broadcast live circular notices, view registered student departments, and export analytics.

➢ **High-Performance MongoDB Database**: Stores schemaless, rich document structures for multi-stage exams, syllabus weightages, and user profiles.
➢ **Fast Omnibar Search Engine**: Tokenized multi-keyword search supporting short acronyms (`nda`, `ias`, `ssc`, `cgl`) with regex word-boundary precision.
➢ **Stateful Profile Customization**: Enables students to save their standard (10th, 12th, B.Tech, etc.) and department to receive one-click matching recruitments.

---

## 2. Environment Description

### 2.1 Hardware and Software Requirements: -

#### Hardware Requirements:
✓ **Processor**: Intel Core i3 / AMD Ryzen 3 or above (x64 Architecture)  
✓ **RAM**: 4 GB RAM minimum (8 GB Recommended for running Vite & MongoDB concurrently)  
✓ **Hard Disk**: 10 GB available SSD/HDD storage space  
✓ **Monitor / Display**: 15" Color Monitor with 1366x768 or 1920x1080 resolution  
✓ **Input Devices**: Standard Keyboard and Mouse / Trackpad  

#### Software Requirements: -

**1. Frontend Environment**:
✓ **HTML5 / CSS3 / JavaScript (ES2022+)**  
✓ **React.js 18 / 19** (Component-driven UI library)  
✓ **Vite 8.x** (Next-generation frontend tooling and bundler)  
✓ **Tailwind CSS 4.x** (Utility-first styling system)  
✓ **Lucide React** (Vector icon library)  

**2. Backend Environment**:
✓ **PHP 8.2 or above** (Engine for RESTful API endpoints)  
✓ **PHP MongoDB Driver (`php_mongodb.dll`)** (Native BSON serialization and query execution)  
✓ **PHP Built-in Web Server** (Running on `localhost:8000`)  

**3. Database**:
✓ **MongoDB Community Server 8.0+** (Document database running on port 27017)  
✓ **MongoDB Shell (`mongosh`)** / **MongoDB Compass** (Database inspection tools)  

**4. Development Tools & Runtime**:
✓ **Node.js 18.x / 20.x LTS** with `npm` package manager  
✓ **Visual Studio Code (VS Code)** (IDE with integrated terminal and debugger)  
✓ **Web Browsers**: Google Chrome, Microsoft Edge, Mozilla Firefox  

---

### 2.2 Technology Used: -

#### 1. React & Vite (Frontend Layer)
➢ **Component-Driven Architecture**: The user interface is broken down into reusable, isolated React components (`ExamCard`, `ExamTableView`, `EligibilityCalculator`, `Navbar`, `CareerIntakeWizard`).
➢ **Fast Hot Module Replacement (HMR)**: Vite provides instant compilation and module replacement, ensuring rapid development and production builds under 350ms.
➢ **Context API State Management**: Utilizes `UIFormatContext` for global persistence of view preferences (Grid, Sarkari Table, Fast Scanner, Stage Timeline) and theme selection (Light / Dark mode).

#### 2. Tailwind CSS & UI Design System
➢ **Flipkart-Signature Clean UI**: Implements a high-contrast white-and-slate canvas (`#2874f0` Flipkart Blue and `#fb641b` Vibrant Orange) with clear card elevations, dense meta-strips, and clean typography.
➢ **Dual Light & Dark Mode**: Full dynamic theming using Tailwind CSS dark mode classes, stored persistently in client `localStorage`.

#### 3. PHP 8.2 (Backend RESTful Layer)
➢ **Lightweight REST API Architecture**: Serves structured JSON responses with standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`).
➢ **Cross-Origin Resource Sharing (CORS)**: Centralized `cors.php` middleware managing headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`).
➢ **Token-Based Authentication**: Mutating operations require validation against administrative session tokens (`Bearer` authentication).

#### 4. MongoDB 8.0 (NoSQL Document Store)
➢ **Hierarchical Document Schema**: Enables complex nested documents containing multiple exam stages, subject weightages, booklists, pay scales, and eligibility relaxation arrays in a single collection.
➢ **BSON Query Engine**: Utilizes PHP `MongoDB\Driver\Manager`, `Query`, and `BulkWrite` for high-throughput CRUD operations.

---

## 3. System Analysis: -

### 3.1 Existing System and its Drawbacks: -

#### Features Present in Existing Systems:
➢ **1. Basic List View**: Legacy platforms list notifications in a tabular format with exam name and last date.
➢ **2. External Hyperlinks**: Links directing users to official commission websites or PDF advertisements.
➢ **3. Categorized Menus**: Top navigation dividing items into Admit Cards, Results, and Latest Jobs.

#### Drawbacks of Existing Systems: -

➢ **1. Disorganized and Cluttered Layout**:
* Existing sites are overrun with pop-up advertisements, third-party redirects, and blinking banners that distract students and degrade device performance.

➢ **2. Zero Academic Stream Precision**:
* A student with a diploma in Mechanical Engineering or a degree in B.Sc Agriculture has to manually read 100+ notifications to see if their qualification is eligible.
* There is no field-level or stream-level filtering mechanism.

➢ **3. Missing Preparation Guidance & Standard Booklists**:
* Legacy portals stop at posting notification links. They provide zero guidance regarding syllabus weightage, important chapters, or standard reference books.

➢ **4. Inflexible Eligibility Evaluation**:
* Existing systems do not account for reservation relaxations (General vs OBC vs SC/ST), minimum graduation marks criteria (e.g. 50% vs 60%), and final-year appearing rules.

➢ **5. Lack of Security & Administrative Control**:
* Many portals run on unauthenticated or outdated architectures without role-based access control or audit logs.

---

## 4. Proposed System: -

### 4.1 Scope: -

#### Current Scope:
➢ **1. Multi-Field Examination Coverage**:
* Supports 20+ authentic Indian recruitments spanning 10 Commission Categories (UPSC, SSC, Railways, Banking, Defense, Medical, State PSC, Teaching, Judiciary, Engineering/PSU).
* Covers 12 specialized academic streams (10th Pass, 12th PCM, Commerce & Finance, Arts, B.Tech Engineering, ITI & Polytechnic, Medical & Nursing, Agriculture, Law).

➢ **2. Multi-Format Directory Views**:
* Users can toggle between 4 distinct views: **Cards Grid (Flipkart Style)**, **Sarkari Table View**, **Fast Compact Scanner**, and **Stage Pipeline Timeline View**.

➢ **3. Real-Time Omnibar Search with Live Suggestions**:
* Global search omnibar in the navbar with auto-suggestions dropdown showing exam title, category badge, stream, and vacancies as the user types.

➢ **4. Intelligent Eligibility Matcher**:
* Evaluates qualifications, passing status, percentage, category relaxation, and age ceilings with clear green/red qualification verdicts.

➢ **5. Student Profile & Customization**:
* Students can register their name, age, standard, and academic department to receive personalized recruitment recommendations.

---

#### Organizational Scope:
➢ Educational institutions, colleges, university placement cells, and career counseling centers can deploy KY EDU to provide authentic career roadmaps to students.
➢ State governments and coaching academies can utilize the platform to broadcast verified exam calendars and booklists without advertisement distractions.

#### Academic Scope:
➢ Demonstrates modern Full-Stack web engineering using **React + PHP + MongoDB**.
➢ Highlights component reusability, responsive design, token-based API authentication, NoSQL document modeling, and complex client-server data synchronization.
➢ Suitable as an advanced major project submission for BCA, B.Tech (CS/IT), and MCA curricula.

---

#### Future Scope:
➢ **1. AI-Powered Mock Test & PYQ Generator**: Automated generation of topic-wise practice questions based on high-yield syllabus weightages.
➢ **2. Native Mobile Application**: Development of an Android and iOS application using React Native with push notifications for admit cards and deadlines.
➢ **3. Direct Commission API Integration**: Automated scraping and syncing with official UPSC, SSC, and NTA notification feeds.
➢ **4. Multilingual Translation**: Localization in Hindi and regional Indian languages to support rural and vernacular aspirants.
➢ **5. WhatsApp / SMS Alert Gateway**: Instant circular notifications sent directly to subscribed candidate mobile numbers.

---

### 4.2 Project Modules: -

#### User / Student Panel Modules →

➢ **1. User Registration & Profile Management Module**:
* New students can create an account with their Name, Email, Password, Phone, Age, Current Standard (10th, 12th, B.Tech, etc.), and Study Department.
* Securely stores student academic data in MongoDB and provides one-click **"Matched Sarkari Exams"** filtering.

➢ **2. Examination Directory & Smart Search Module**:
* Allows real-time search across titles, conducting bodies, pay scales, qualifications, and post names.
* Features dual-layer filter chips: **Board Category** (Blue `#2874f0`) and **Academic Stream** (Orange `#fb641b`).

➢ **3. Exam Details & Standard Booklist Modal Module**:
* Displays in-depth exam profiles including 7th CPC Pay Scale, total vacancies, multi-stage selection patterns, syllabus percentage weightages, high-yield chapters, and recommended Indian author textbooks.

➢ **4. Interactive Eligibility Matcher Module**:
* Form allowing aspirants to input their exact degree (14 Indian qualification options), passing status, percentage, age, and reservation category.
* Generates an immediate verdict displaying minimum requirements, age relaxation rules, and recognized qualifications.

➢ **5. Academic Stream & Career Roadmaps Module**:
* Step-by-step career path guides for 10th/ITI, Polytechnic Diplomas, B.Sc Agriculture, Law, Nursing, and Civil Services detailing popular courses, top employers, and average starting salaries.

➢ **6. Side-by-Side Exam Comparison Module**:
* Allows aspirants to select any two exams (e.g. UPSC CSE vs SSC CGL or NDA vs CDS) and view a side-by-side comparison of vacancies, salary, syllabus, and difficulty stages.

---

#### Admin Panel Modules →

➢ **1. Admin Authentication & Security Module**:
* Multi-factor administrative login featuring a 6-digit Quick PIN (`123456`) and SuperAdmin credentials (`admin@kyedu.in` / `KYEDU@2026`).
* Generates secure Bearer tokens required for all backend modification requests.

➢ **2. Executive Analytics & Dashboard Module**:
* Real-time metrics overview displaying Total Examinations, Career Pathways, Live Circulars, Total Registered Students, and Department Breakdown charts.

➢ **3. Examination CRUD Management Module**:
* Complete administrative control to Add New Exam, Edit Existing Exam, and Delete Exam records from the MongoDB database with instant portal synchronization.

➢ **4. Live Circular & Notice Broadcasting Module**:
* Allows administrators to post real-time alerts regarding admit card releases, exam date postponements, and result announcements.

➢ **5. Student Directory & Export Module**:
* Displays all registered students with their standard, department, and contact details with full search, sorting, and CSV export capabilities.

---

## 5. Detail Planning

### 5.1 System Architecture & Data Flow: -

```
+-------------------------------------------------------------------------+
|                           CLIENT / USER LAYER                           |
|                    React 18/19 SPA + Vite + Tailwind CSS                |
|                    http://localhost:5173 (Port 5173)                    |
+------------------------------------+------------------------------------+
                                     |
                                     | REST HTTP Calls (JSON)
                                     | Bearer Token (Admin)
                                     v
+-------------------------------------------------------------------------+
|                           BACKEND API LAYER                             |
|                        PHP 8.2 Modular REST API                         |
|                    http://localhost:8000 (Port 8000)                    |
|                                                                         |
|  - CORS & Error Handling Middleware (config/cors.php)                   |
|  - Database Connection Manager (config/Database.php)                    |
|  - Authentication Controller (api/login.php, api/user_auth.php)         |
|  - Exams & Updates Controller (api/exams.php, api/updates.php)          |
|  - Eligibility Logic Engine (api/eligibility.php)                       |
|  - Career Roadmaps & Stats (api/careers.php, api/stats.php)             |
+------------------------------------+------------------------------------+
                                     |
                                     | Native BSON Driver
                                     | (MongoDB\Driver\Manager)
                                     v
+-------------------------------------------------------------------------+
|                           DATABASE LAYER                                |
|                        MongoDB 8.0 (NoSQL)                              |
|                    mongodb://localhost:27017/ky_edu_db                  |
|                                                                         |
|   Collections:                                                          |
|   - exams     : Government recruitments, syllabus, salary, booklists    |
|   - careers   : Career roadmaps, courses, job profiles, growth outlook  |
|   - updates   : Live Sarkari circular notices, ticker alerts            |
|   - users     : Registered student profiles, standards & departments    |
|   - admins    : System administrators, hashed credentials & PINs        |
+-------------------------------------------------------------------------+
```

---

### Data Flow Diagram (DFD Level 0 - Context Level): -

```
                    +-----------------------------+
                    |                             |
                    |     Aspirant / Student      |
                    |                             |
                    +--------------+--------------+
                                   |
                     1. Search & Filter Requests
                     2. Eligibility Inputs (Age, Degree)
                     3. Student Registration / Profile
                                   |
                                   v
                    +-----------------------------+
                    |                             |
                    |           KY EDU            |
                    |    Online Guidance Portal   |
                    |                             |
                    +--------------+--------------+
                                   ^
                                   |
                     4. Admin Login (PIN / Password)
                     5. Exam CRUD Operations
                     6. Live Circular Announcements
                                   |
                    +--------------+--------------+
                    |                             |
                    |        Administrator        |
                    |                             |
                    +-----------------------------+
```

---

### Use Case Diagram Specification: -

| Actor | Use Cases Accessible |
| :--- | :--- |
| **Aspirant / Student** | • View Homepage & Live Notices Ticker<br>• Search Exams with Auto-Suggestions<br>• Filter by Board Category & Academic Stream<br>• View Exam Details, Syllabus Weightage & Booklists<br>• Calculate Eligibility with Reservation Relaxations<br>• Compare Exams Side-by-Side<br>• Explore Career Streams & Degree Roadmaps<br>• Register Student Account & Save Study Details<br>• Toggle Light & Dark Mode UI |
| **Administrator** | • Secure Login with PIN (`123456`) or Credentials<br>• Access Executive Dashboard & Metrics<br>• Add / Edit / Delete Examination Records<br>• Post Live Circular & Notice Updates<br>• View Registered Student Directory & Department Stats<br>• Export Student Data to CSV<br>• Refresh / Re-Seed Database |

---

### 5.2 Data Dictionary: -

#### 1. `exams` Collection (Examinations & Vacancy Specifications)

| Field Name | BSON Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier of the examination record |
| `title` | String | Not Null | Complete official title of the recruitment |
| `shortName` | String | Not Null | Concise acronym (e.g., `UPSC CSE`, `SSC CGL`) |
| `conductingBody` | String | Not Null | Official Commission / Board (e.g., `UPSC`, `SSC`, `RRB`) |
| `category` | String | Not Null | Board Category (`UPSC`, `SSC`, `Banking`, `Railways`, etc.) |
| `stream` | String | Not Null | Academic Stream (`Science (PCM)`, `Commerce`, `Agriculture`, etc.) |
| `featured` | Boolean | Default: false | Highlights exam on homepage carousel |
| `status` | String | Enum | Status (`Active`, `Admit Card Out`, `Exam Ongoing`, `Upcoming`) |
| `vacancies` | Number | Not Null | Total number of vacancies announced |
| `posts` | Array of Strings | Not Null | List of official designated posts |
| `eligibility` | Object | Not Null | Contains `minAge`, `maxAge`, `education`, `educationLevel`, `attempts` |
| `salary` | Object | Not Null | Contains `payLevel`, `payScale`, `inHandEstimate`, `perks` |
| `stages` | Array of Objects | Not Null | Multi-tier selection process details (Prelims, Mains, Interview) |
| `subjectDetails`| Array of Objects | Optional | High-yield subjects, weightages, chapters, and booklists |
| `timeline` | Array of Objects | Optional | Key milestone dates and statuses |
| `createdAt` | DateTime / String| Not Null | Timestamp of record creation |
| `updatedAt` | DateTime / String| Not Null | Timestamp of last modification |

---

#### 2. `users` Collection (Student Profiles)

| Field Name | BSON Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique student identifier |
| `name` | String | Not Null | Full name of the student |
| `email` | String | Unique, Not Null | Email address used for authentication |
| `password` | String | Not Null | Hashed student password |
| `phone` | String | Optional | Student mobile contact number |
| `age` | Number | Not Null | Student age for eligibility matching |
| `std` | String | Not Null | Academic Standard (`10th Pass`, `12th PCM`, `B.Tech`, etc.) |
| `department` | String | Not Null | Study Department (`Engineering`, `Commerce`, `Agriculture`, etc.) |
| `createdAt` | DateTime / String| Not Null | Account creation timestamp |
| `updatedAt` | DateTime / String| Not Null | Profile last updated timestamp |

---

#### 3. `careers` Collection (Degree & Stream Roadmaps)

| Field Name | BSON Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique career roadmap identifier |
| `stream` | String | Not Null | Educational background name (e.g. `10th & ITI Trades`) |
| `title` | String | Not Null | Comprehensive career pathway heading |
| `overview` | String | Not Null | Narrative explanation of career prospects and scope |
| `popularCourses`| Array of Strings | Not Null | Key diplomas/degrees available under this stream |
| `keyEntranceExams`| Array of Strings| Not Null | Official entrance exams for this pathway |
| `topRoles` | Array of Strings | Not Null | Industry and government designations |
| `averageStartingSalary`| String | Not Null | Estimated initial CTC range |
| `topEmployers` | Array of Strings | Not Null | Premier public and private hiring bodies |
| `roadmapSteps` | Array of Objects | Not Null | Sequential step-by-step career progression steps |
| `relatedGovtExams`| Array of Strings| Optional | Exams linked to this background in the portal |

---

#### 4. `updates` Collection (Live Circulars & Announcements)

| Field Name | BSON Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique notice identifier |
| `title` | String | Not Null | Headline of the circular or notification |
| `date` | String | Not Null | Publication date |
| `examShortName`| String | Not Null | Associated exam acronym |
| `badge` | String | Not Null | Announcement badge (`Admit Card`, `Result`, `Important`) |
| `summary` | String | Not Null | Brief description of circular contents |
| `link` | String | Optional | Direct link to official commission PDF |
| `createdAt` | DateTime / String| Not Null | Timestamp of broadcast |

---

#### 5. `admins` Collection (System Administrators)

| Field Name | BSON Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Administrator identifier |
| `username` | String | Not Null | Admin login username |
| `email` | String | Unique, Not Null | Administrative email (`admin@kyedu.in`) |
| `password` | String | Not Null | Hashed administrative password |
| `pin` | String | Not Null | 6-Digit rapid access PIN (`123456`) |
| `role` | String | Enum | System Role (`superadmin`, `editor`) |
| `token` | String | Optional | Active Bearer session authorization token |

---

## 6. System Design & User Interface

### User Panel Screens: -

#### 1. Home Screen: -
➢ **Flipkart-Signature Header & Omnibar**: Features the prominent brand logo, real-time search input with live auto-suggestions, theme switcher (Light/Dark), student greeting, and quick links.
➢ **Live Sarkari Circular Ticker**: An amber banner ticker displaying real-time updates regarding admit cards, result announcements, and notifications.
➢ **Top Category Navigation Strip**: Horizontal scrollable categories (`10th & 12th Pass`, `ITI & Diploma`, `Civil Services`, `SSC`, `Railways`, `Medical`, `Agriculture`, `Teaching`, `Defense`) that apply instant pre-filters.
➢ **Featured Examination Cards Grid**: 4-column Flipkart-style cards showcasing recruitment title, conducting body, total vacancies, 7th CPC starting pay, and verified status pills.

---

#### 2. Student Authentication & Profile Screen: -
➢ **User Login Modal**: Clean dual-tab modal allowing students to log in using their registered email and password.
➢ **Student Registration Modal**: Allows new aspirants to register with Name, Email, Password, Age, Academic Standard (`10th`, `12th PCM`, `B.Tech`, `B.Sc Agriculture`, etc.), and Department.
➢ **Student Profile Bar**: Displays personalized greetings on the homepage (e.g. *Namaste, Rohan • B.Tech / B.E (Engineering)*) with a direct **"Matched Sarkari Exams"** button that immediately filters recruitments suitable for their study background.

---

#### 3. Sarkari Examinations Directory & Smart Search Screen: -
➢ **Global Search Omnibar**: Tokenized multi-word search bar that matches keywords across Title, Acronym, Commission, Stream, Education Level, and Designated Posts with regex word-boundary precision.
➢ **Dual-Tier Filter Chips**:
* **Board Category Chips (Flipkart Blue `#2874f0`)**: Quick toggles for `UPSC`, `SSC`, `Banking`, `Railways`, `Defense`, `Medical`, `State PSC`, `Engineering/PSU`, `Teaching`, and `Law`.
* **Academic Field / Stream Chips (Vibrant Orange `#fb641b`)**: Direct selection for `All Fields`, `Any Stream`, `10th Pass`, `12th Pass (10+2)`, `Science (PCM)`, `Commerce & Finance`, `Arts & Teaching`, `Engineering (B.Tech)`, `ITI / Diploma`, `Medical & Nursing`, `Agriculture (AFO)`, and `Law & Judiciary`.
➢ **Multi-Format View Switcher**: Instant switching between **Cards Grid**, **Sarkari Table**, **Fast Scanner**, and **Stage Pipeline**.
➢ **Zero-Failure Filter Recovery**: Displays a contextual recovery button (*"Search in All Categories"*) if a user searches for an exam while an unrelated category filter is active.

---

#### 4. Examination Details & Standard Booklists Modal: -
➢ **Header Strip**: Shows conducting body, official exam code, active status badge, and total vacancies.
➢ **Tab 1: Overview & 7th CPC Pay Scale**: Comprehensive breakdown of basic pay, in-hand monthly salary estimates, and government perks (CGHS Medical, House Rent Allowance, Official Vehicles).
➢ **Tab 2: Selection Stages & Exam Pattern**: Multi-stage tier cards detailing question count, time duration, marking schemes, and negative marking rules.
➢ **Tab 3: Subject Details & Recommended Booklists**: In-depth syllabus weightages (e.g. Quantitative Aptitude 25%, Indian Polity 20%), key scoring chapters, and authoritative textbooks (*M. Laxmikanth*, *Dr. R.S. Aggarwal*, *Spectrum Modern India*, *NCERTs*).

---

#### 5. Eligibility Matcher & Calculator Screen: -
➢ **Candidate Intake Controls**: Interactive input for candidate qualification (14 recognized Indian degrees), qualification status (*Appearing in Final Year* vs *Completed / Passed*), aggregate percentage, candidate age slider, and reservation category (`General`, `OBC`, `SC/ST`, `EWS`, `PwD`).
➢ **Live Compatibility Verdict**: Evaluates every recruitment in MongoDB and produces green compatibility cards highlighting age relaxation benefits, recognized degrees, and minimum percentage criteria.

---

#### 6. Career Scopes & Degree Roadmaps Screen: -
➢ **Stream Directory**: Dedicated exploratory guides for diverse academic paths (ITI, Polytechnic, B.Sc Agriculture, Law, Nursing, Open Schooling NIOS/IGNOU, 12th PCM/PCB/Commerce/Arts).
➢ **Step-by-Step Roadmaps**: Detailed progression steps outlining course selection, mandatory apprenticeships, entrance tests, and premier government employers.

---

#### 7. Side-by-Side Exam Comparison Screen: -
➢ Allows aspirants to select any two government recruitments (e.g. `UPSC CSE` vs `SSC CGL` or `NDA` vs `CDS`) and renders a comparative analysis across Age Ceilings, Pay Scales, Total Posts, Selection Stages, and Educational Thresholds.

---

### Admin Panel Screens: -

#### 1. Admin Authentication Screen: -
➢ **Dual Access Security**: Supports instant 6-digit administrative PIN verification (`123456`) or standard SuperAdmin email credentials (`admin@kyedu.in`).
➢ **Token Generation**: Issues an authenticated session token stored securely in `sessionStorage` and automatically attached to all CRUD network requests.

---

#### 2. Executive Dashboard Screen: -
➢ **Metric Cards**: Total Active Examinations (20), Educational Pathways, Live Broadcast Circulars, and Registered Students.
➢ **Department Distribution Analytics**: Visual distribution of student registrations across Engineering, Agriculture, Medical, Commerce, and Defense.
➢ **Recent Activity Audit Feed**: Chronological log of recent exam updates and student enrollments.

---

#### 3. Examination Management Screen: -
➢ **CRUD Data Table**: Tabular view of all database records with search, category filtering, vacancy counts, and action buttons (*Edit*, *Delete*, *Post Update*).
➢ **Add / Edit Exam Modal Form**: Multi-field form to create or modify exam titles, short names, commissions, categories, streams, pay levels, eligibility rules, and syllabus details.

---

#### 4. Live Circular & Notice Broadcasting Screen: -
➢ Dedicated interface for administrators to publish time-sensitive circulars (Admit Cards, Results, Answer Keys, Application Deadlines) that immediately update the homepage live ticker.

---

#### 5. Student User Directory Screen: -
➢ Searchable directory of all student users registered on the portal displaying full name, email, phone, age, academic standard, and department, with one-click **CSV Export** for administrative reporting.

---

## 7. Testing & Verification

### 7.1 Automated & Manual Test Results: -

| Test Case ID | Feature Tested | Input / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Backend Public Access | `GET /api/exams.php` | Returns all 20 exam records with HTTP 200 | **PASS** |
| **TC-02** | Admin Anti-Tampering | `POST /api/exams.php` without token | Request blocked with HTTP 403 Forbidden | **PASS** |
| **TC-03** | Admin PIN Authentication | Submit PIN `123456` | Admin session verified, Bearer token returned | **PASS** |
| **TC-04** | Exam Creation (CRUD) | `POST /api/exams.php` with valid payload | New exam document inserted in MongoDB | **PASS** |
| **TC-05** | Real-Time Live Notice | `POST /api/updates.php` | Circular added to exam timeline & live ticker | **PASS** |
| **TC-06** | Student User Registration | Submit Name, Email, Std, Dept | User document stored in MongoDB `users` | **PASS** |
| **TC-07** | Omnibar Auto-Suggestions | Type "upsc" in navbar search | Dropdown displays matching UPSC examinations | **PASS** |
| **TC-08** | Multi-Word Search | Type "upsc 12th" | Returns `UPSC NDA (10+2)` accurately | **PASS** |
| **TC-09** | Short Acronym Word Boundary| Type "nda" in search | Matches only NDA exam, eliminates "standard" false positives | **PASS** |
| **TC-10** | Stream Filter Matching | Click "Agriculture (AFO)" chip | Filters to `IBPS SO AFO` without zero-result failure | **PASS** |
| **TC-11** | Eligibility Calculator | Age 22, B.Tech, General | Matches B.Tech recruitments (ISRO, SSC JE, RRB ALP, etc.) | **PASS** |
| **TC-12** | Frontend Production Build | `npm run build` via Vite | Build compiled cleanly with zero syntax/JSX errors | **PASS** |

---

## 8. Conclusion

➢ **KY EDU** successfully transforms the experience of Indian students searching for government recruitments and academic career roadmaps.
➢ By eliminating deceptive advertisements, broken links, and ambiguous eligibility criteria, the platform provides a verified, transparent, and authoritative one-stop gateway.
➢ The incorporation of specialized streams—such as ITI Craftsmen, Polytechnic Junior Engineering, B.Sc Agriculture, Law, and Nursing—ensures that every student finds their dedicated career pathway.
➢ The clean, Flipkart-inspired interface, paired with an intelligent multi-factor eligibility calculator and standard booklists, makes this portal a comprehensive digital solution for competitive examination aspirants across India.

---

## 9. References

1. **PHP Official Documentation & Manual**: *PHP 8.2 Object-Oriented Programming and Extensions*. Available at: https://www.php.net/manual/en/
2. **MongoDB Documentation**: *MongoDB 8.0 Manual and PHP Driver BSON Architecture*. Available at: https://www.mongodb.com/docs/manual/
3. **React.js Documentation**: *React 18 / 19 Components, State & Hooks API*. Available at: https://react.dev/
4. **Vite Development Tooling**: *Vite Next Generation Frontend Tooling Guide*. Available at: https://vitejs.dev/
5. **Tailwind CSS Documentation**: *Utility-First CSS Framework Specification*. Available at: https://tailwindcss.com/
6. **Union Public Service Commission (UPSC)**: *Official Examination Calendars and Gazette Notifications*. Available at: https://upsc.gov.in/
7. **Staff Selection Commission (SSC)**: *Official Recruitment Notices and 7th CPC Pay Matrices*. Available at: https://ssc.gov.in/
8. **Railway Recruitment Boards (RRB)**: *Centralized Employment Notices (CEN) for ALP & Technicians*. Available at: https://indianrailways.gov.in/
9. **Institute of Banking Personnel Selection (IBPS)**: *Specialist Officers (AFO) & Probationary Officers Guidelines*. Available at: https://ibps.in/
10. **Ministry of Education, Government of India**: *National Institutional Ranking Framework & Recognized Degrees*. Available at: https://www.education.gov.in/
