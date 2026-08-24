SocietyOS

A production-oriented full-stack society management platform for residents and society administrators.








Overview

SocietyOS brings common residential-society workflows into one platform instead of relying on spreadsheets, chat groups, phone calls, and disconnected processes.

It provides secure, role-based access for residents and administrators and covers society management, residents, complaints, maintenance, announcements, meetings, payments, notifications, and AI-assisted help.

Core Modules

Authentication & User Management

Society & Building Management

Unit & Resident Management

Admin Management & Invitations

Complaints & Maintenance

Announcements & Communication

Meetings & Events

Maintenance & Payments

AI Help Chatbot

Key Features

User registration, login, OTP verification, password reset, JWT authentication

Society registration, verification, buildings, units, and membership management

Resident onboarding and administrator invitations

Complaint creation, tracking, assignment, and status management

Maintenance dues, due dates, payment workflow, and payment status

Society announcements and notifications

Meeting scheduling, upcoming meetings, and cancellation

Role-based and society-level authorization

AI-assisted help using Gemini integration

PostgreSQL database with Flyway migrations

User Roles

Residents

View society and unit information

View announcements and meetings

Raise and track complaints

View maintenance information

Manage profile

Use AI Help

Society Administrators

Manage society, buildings, units, and residents

Manage invitations and memberships

Manage complaints and maintenance

Publish announcements

Manage meetings

Administrator permissions are enforced by the backend.

Technology Stack

Backend

Java 24

Spring Boot

Spring Security

JWT

Spring Data JPA / Hibernate

PostgreSQL

Flyway

Maven

REST APIs

Frontend

React

TypeScript

Vite

Axios

React Router

CSS

AI & Infrastructure

Gemini

Vercel

Render

GitHub

Architecture

                    SocietyOS Frontend
                 React + TypeScript + Vite
                           |
                      HTTPS / REST
                           |
                           v
                    SocietyOS Backend
                    Spring Boot / Java
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
        PostgreSQL     Spring Security  Gemini
         Database          + JWT          AI

Backend Architecture

Controller
|
Service
|
Repository
|
PostgreSQL

Controllers handle HTTP requests, services contain business logic and validation, and repositories provide database access through JPA.

Frontend Architecture

Pages / Components / Layouts
|
Services
|
REST API
|
Spring Boot API

Authentication & Authorization

SocietyOS uses Spring Security with JWT-based authentication.

Register / Login
|
Authentication API
|
Access + Refresh Token
|
Frontend Session
|
Authenticated Request
|
JWT Validation
|
Authorized Resource

Protected operations validate authentication, society membership, membership status, role, and relevant society/building/unit relationships.

Database

PostgreSQL is the primary relational database.

Flyway manages schema migrations for areas including:

Users and identity

Societies and memberships

Buildings and units

Residents

Complaints

Announcements

Meetings

Maintenance

Notifications

Invitations

AI conversations

API

Production API base URL:

https://societyos-63sh.onrender.com/api/v1

Major API areas include authentication, users, societies, buildings, units, residents, invitations, complaints, maintenance, announcements, meetings, notifications, and AI.

Project Structure

societyos/
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md

Local Development

Prerequisites

Java JDK

Maven

Node.js and npm

PostgreSQL

Git

Clone

git clone https://github.com/Ankit-code02/societyos.git
cd societyos

Backend

cd backend
.\mvnw.cmd clean package
.\mvnw.cmd spring-boot:run

Backend runs on:

http://localhost:8080

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

For local development, configure:

VITE_API_URL=http://localhost:8080/api/v1

Never commit private credentials or secrets.

Production Deployment

                    Internet
                       |
                       v
                 Vercel
              React + Vite
                       |
                    HTTPS
                       |
                       v
                 Render
              Spring Boot API
                       |
                       v
              Render PostgreSQL

Live Links

Frontend:
https://societyos-psi.vercel.app

Backend:
https://societyos-63sh.onrender.com

API:
https://societyos-63sh.onrender.com/api/v1

Health Check:
https://societyos-63sh.onrender.com/actuator/health

GitHub:
https://github.com/Ankit-code02/societyos

Health Monitoring

The production health endpoint is:

https://societyos-63sh.onrender.com/actuator/health

Expected response:

{
"status": "UP"
}

Security

Spring Security

JWT authentication

Access and refresh tokens

OTP verification

Password reset

Protected API endpoints

Role-based authorization

Society membership authorization

Protected frontend routes

Environment-based configuration

Secrets excluded from Git

Current Status

Completed

Authentication and user management

Society and building management

Units and residents

Invitations

Complaints

Maintenance and payment workflow

Announcements and notifications

Meetings

AI Help

Role-based authorization

PostgreSQL and Flyway

Production backend deployment

Production frontend deployment

Backend health monitoring

Future Improvements

Real payment gateway

Push notifications

Advanced analytics and financial reporting

Visitor and vendor management

Document management

Advanced AI automation

Mobile applications

Subscription and billing

Audit logging

Advanced dashboards

Automated testing and CI/CD

Performance monitoring and error tracking

Project Links

Resource

Link

Live App

https://societyos-psi.vercel.app

Backend

https://societyos-63sh.onrender.com

API

https://societyos-63sh.onrender.com/api/v1

Health

https://societyos-63sh.onrender.com/actuator/health

GitHub

https://github.com/Ankit-code02/societyos

Author

Ankit Maurya

GitHub: https://github.com/Ankit-code02

License

This project is currently intended as a portfolio and development project.