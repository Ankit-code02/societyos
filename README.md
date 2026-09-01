# 🏢 SocietyOS

> A full-stack society management platform that brings residential community operations into one centralized application.

<p align="center">
  <a href="https://societyos-psi.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-SocietyOS-2F81F7?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
  <a href="https://github.com/Ankit-code02/societyos">
    <img src="https://img.shields.io/badge/Source%20Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-24-orange?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-TypeScript-3178C6?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

---

## 📌 Overview

**SocietyOS** is a full-stack web application designed to digitize everyday residential society operations.

Instead of relying on spreadsheets, chat groups, phone calls, and disconnected processes, SocietyOS provides a centralized platform for:

- 👥 Resident management
- 🏢 Society and building management
- 🛠️ Complaints and maintenance
- 📢 Announcements
- 📅 Meetings and events
- 💳 Maintenance dues and payment workflows
- 🔔 Notifications
- 🤖 AI-assisted help

The application provides separate resident and administrator workflows with backend-enforced authentication, authorization, and society membership validation.

---

## 🎯 Problem

Residential communities often manage important operations through disconnected tools:

- Resident information stored in spreadsheets
- Complaints raised through chat groups
- Maintenance tracked manually
- Announcements distributed across multiple channels
- Meetings managed through informal communication
- Resident onboarding handled manually
- Limited centralized visibility for administrators

**SocietyOS brings these workflows into one structured platform.**

---

# ✨ Key Features

## 🔐 Authentication & Security

- User registration and login
- OTP verification
- Password reset
- JWT authentication
- Access and refresh tokens
- Protected API endpoints
- Protected frontend routes
- Role-based authorization
- Society membership validation

## 🏢 Society Management

- Society registration
- Society onboarding and verification
- Building management
- Unit management
- Resident management
- Society membership management
- Resident invitations
- Role assignment

## 🛠️ Complaints & Maintenance

- Create and track complaints
- Complaint categories and priorities
- Complaint status management
- Complaint assignment
- Maintenance dues
- Due-date tracking
- Unit-level maintenance information
- Payment workflow

## 📢 Communication

- Society announcements
- Published announcements
- Resident communication
- Notifications

## 📅 Meetings & Events

- Meeting creation
- Meeting scheduling
- Upcoming meetings
- Meeting status
- Meeting cancellation

## 🤖 AI Help

SocietyOS includes an AI-assisted help experience powered through a Gemini integration.

The backend provides:

- AI provider abstraction
- Conversation handling
- Message handling
- AI-related REST endpoints

---

# 👥 User Roles

SocietyOS currently supports role-based access control for different users.

### 🧑 Resident

Residents can access functionality such as:

- Society information
- Unit information
- Announcements
- Complaints
- Maintenance information
- Meetings
- Notifications
- Profile management
- AI Help

### 👨‍💼 Society Administrator

Administrators can manage:

- Society structure
- Buildings
- Units
- Residents
- Invitations
- Complaints
- Maintenance
- Announcements
- Meetings

All important authorization checks are enforced on the backend.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │       SocietyOS           │
                         │        Frontend           │
                         │   React + TypeScript      │
                         │          Vite             │
                         └────────────┬─────────────┘
                                      │
                                  HTTPS / REST
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │       SocietyOS           │
                         │        Backend            │
                         │    Java + Spring Boot     │
                         └────────────┬─────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
             ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
             │ PostgreSQL  │  │   Spring     │  │  Gemini AI  │
             │   Database  │  │   Security   │  │  Assistant  │
             └─────────────┘  │     + JWT    │  └─────────────┘
                              └──────────────┘
```

---

# ⚙️ Backend Architecture

The backend follows a layered architecture that separates HTTP handling, business logic, and persistence.

```text
HTTP Request
     │
     ▼
┌───────────────┐
│   Controller  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    Service    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Repository  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   PostgreSQL  │
└───────────────┘
```

### Controller

Handles HTTP requests and API responses.

### Service

Contains business logic, validation, authorization checks, and transaction boundaries.

### Repository

Provides database access through Spring Data JPA.

### DTOs

Define structured request and response models.

### Entities

Represent persistent domain models and their relationships.

---

# 🎨 Frontend Architecture

```text
                 React Application
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       Pages       Components       Layouts
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
                    Services
                        │
                        ▼
                    REST API
                        │
                        ▼
                 Spring Boot API
```

The frontend is organized around:

- Pages
- Components
- Layouts
- Hooks
- Services
- Types
- Authentication
- Resident workflows
- Administrator workflows

---

# 🔒 Authentication & Authorization

SocietyOS uses **Spring Security + JWT** for authentication and backend authorization.

### Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Authentication API
 │
 ▼
Access Token + Refresh Token
 │
 ▼
Frontend Session
 │
 ▼
Authenticated API Request
 │
 ▼
Spring Security
 │
 ▼
JWT Validation
 │
 ▼
Authorized Resource
```

### Backend authorization validates

- Authenticated user
- User role
- Society membership
- Membership status
- Society ownership
- Building/society relationship
- Unit/society relationship

This prevents users from accessing resources belonging to another society.

---

# 🗄️ Database

SocietyOS uses **PostgreSQL** as its primary relational database.

Database schema changes are managed using **Flyway migrations**.

### Major domain areas

```text
Identity
Societies
Society Members
Buildings
Units
Residents
Invitations
Complaints
Maintenance
Announcements
Meetings
Notifications
AI Conversations
```

---

# 🧰 Technology Stack

## Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- PostgreSQL
- Flyway
- Maven
- Lombok
- REST APIs

## Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- CSS

## AI

- Gemini
- AI provider abstraction

## Development

- Git
- GitHub
- IntelliJ IDEA
- VS Code
- Maven
- npm
- Postman

## Deployment

- Vercel
- Render
- PostgreSQL
- GitHub

---

# 📂 Project Structure

```text
societyos/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── societyos/
│   │   │   │           ├── ai/
│   │   │   │           ├── auth/
│   │   │   │           ├── notification/
│   │   │   │           ├── society/
│   │   │   │           └── user/
│   │   │   └── resources/
│   │   │       ├── application.yaml
│   │   │       └── db/
│   │   │           └── migration/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

# 🚀 Running Locally

## Prerequisites

Make sure you have:

- Java JDK
- Maven
- Node.js
- npm
- PostgreSQL
- Git

## 1. Clone the repository

```bash
git clone https://github.com/Ankit-code02/societyos.git
cd societyos
```

## 2. Start the backend

```bash
cd backend

.\mvnw.cmd clean package

.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

## 3. Start the frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

---

# 🔧 Environment Configuration

Create:

```text
frontend/.env
```

For local development:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

The frontend reads the API URL using:

```typescript
import.meta.env.VITE_API_URL
```

> ⚠️ Never commit passwords, API keys, database credentials, JWT secrets, or other private credentials to Git.

---

# ☁️ Deployment

SocietyOS uses a separated frontend, backend, and database deployment model.

```text
                    Internet
                       │
                       ▼
               ┌───────────────┐
               │    Vercel     │
               │ React + Vite  │
               └───────┬───────┘
                       │
                    HTTPS
                       │
                       ▼
               ┌───────────────┐
               │    Render     │
               │ Spring Boot   │
               │     API       │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │  PostgreSQL   │
               │    Render     │
               └───────────────┘
```

### Frontend

Deployed on Vercel.

### Backend

Deployed on Render.

### Database

PostgreSQL hosted through Render.

### Database migrations

Managed with Flyway.

---

# ❤️ Health Monitoring

The Spring Boot backend exposes an Actuator health endpoint.

```text
https://societyos-63sh.onrender.com/actuator/health
```

Expected healthy response:

```json
{
  "status": "UP"
}
```

---

# 📊 Current Project Status

SocietyOS has reached a **deployed V1 state**.

### ✅ Implemented

- Authentication and user management
- Society registration and verification
- Building management
- Unit management
- Resident management
- Resident invitations
- Complaints
- Maintenance dues
- Payment workflow
- Announcements
- Notifications
- Meetings
- AI Help
- Role-based access control
- PostgreSQL database
- Flyway migrations
- Frontend deployment
- Backend deployment
- Health monitoring

---

# 🔮 Future Improvements

Planned improvements include:

- Production payment gateway integration
- Push notifications
- Advanced society analytics
- Financial reporting
- Visitor management
- Vendor management
- Document management
- Advanced AI automation
- Mobile applications
- Subscription and billing
- Audit logging
- Advanced administrator dashboards
- Automated CI/CD pipelines
- Automated testing pipelines
- Centralized logging
- Error tracking and observability

---

# 💡 What This Project Demonstrates

SocietyOS was built as more than a basic CRUD application.

The project demonstrates practical experience with:

- REST API development
- Layered backend architecture
- Spring Security
- JWT authentication
- Role-based authorization
- Relational database design
- Database migrations
- React frontend development
- TypeScript
- Backend/frontend integration
- Environment-based configuration
- Cloud deployment
- Health monitoring
- Domain-driven feature organization
- AI API integration

---

# 🔗 Project Links

| Resource | Link |
|---|---|
| 🌐 Live Application | https://societyos-psi.vercel.app |
| ⚙️ Backend | https://societyos-63sh.onrender.com |
| ❤️ Backend Health | https://societyos-63sh.onrender.com/actuator/health |
| 📡 API Base URL | https://societyos-63sh.onrender.com/api/v1 |
| 💻 GitHub Repository | https://github.com/Ankit-code02/societyos |

---

# 👨‍💻 Author

**Ankit Maurya**

Java Developer focused on Java, Spring Boot, REST APIs, React, PostgreSQL, and Docker.

- 💻 GitHub: https://github.com/Ankit-code02
- 💼 LinkedIn: https://www.linkedin.com/in/ankit0209/
- 🌐 Portfolio: https://ankit-portfolio-two-brown.vercel.app

---

## 📄 License

This project is currently intended as a portfolio and development project.
