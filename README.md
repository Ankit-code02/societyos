# SocietyOS

> A production-oriented full-stack society management platform for residents, administrators, and society management teams.

![Java](https://img.shields.io/badge/Java-24-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple)
![Spring Security](https://img.shields.io/badge/Security-Spring%20Security-green)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-black)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Goals](#goals)
- [Core Modules](#core-modules)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Authentication and Authorization](#authentication-and-authorization)
- [Database](#database)
- [API Architecture](#api-architecture)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Health Monitoring](#health-monitoring)
- [Security](#security)
- [Current Project Status](#current-project-status)
- [Future Improvements](#future-improvements)
- [Development Approach](#development-approach)
- [Project Links](#project-links)
- [Author](#author)
- [License](#license)

---

## Overview

SocietyOS is a full-stack society management platform designed to centralize the everyday operations of residential societies.

Residential communities often rely on WhatsApp groups, spreadsheets, manual registers, phone calls, and disconnected processes to manage residents, complaints, maintenance, announcements, meetings, and society administration.

SocietyOS brings these workflows into one platform.

The application provides separate capabilities for residents and society administrators while enforcing authentication, authorization, society membership, and role-based access throughout the system.

---

## Problem Statement

Residential societies commonly face several operational problems:

- Resident information is maintained in spreadsheets.
- Complaints are raised through informal communication channels.
- Maintenance dues are tracked manually.
- Important announcements can get lost in chat groups.
- Meeting information is distributed across different channels.
- Resident onboarding can be manual and difficult to track.
- Society administrators have limited centralized visibility.
- Society information is distributed across multiple tools.

SocietyOS addresses these problems by providing a centralized digital platform for society operations.

---

## Goals

1. Centralize society management workflows.
2. Provide secure authentication and authorization.
3. Provide structured resident and unit management.
4. Simplify complaint and maintenance management.
5. Improve society-wide communication.
6. Provide structured meeting management.
7. Support society verification and onboarding.
8. Provide AI-assisted help for common society-related questions.
9. Maintain a scalable backend architecture.
10. Provide a deployable production-oriented application.

---

# Core Modules

SocietyOS V1 is organized around the following core modules:

1. Authentication & User Management
2. Society & Building Management
3. Unit & Resident Management
4. Admin Management & Invitations
5. Complaints & Maintenance
6. Announcements & Communication
7. Meetings & Events
8. Maintenance & Payments
9. AI Help Chatbot

---

# Key Features

## 1. Authentication & User Management

- User registration
- User login
- OTP verification
- Password reset
- JWT-based authentication
- Access tokens
- Refresh tokens
- Protected API endpoints
- Protected frontend routes
- User profile management
- Role-based authorization

## 2. Society & Building Management

- Society registration
- Society onboarding
- Society verification
- Society status management
- Building management
- Building creation
- Building retrieval
- Society membership management
- Society-level authorization

## 3. Unit & Resident Management

- Unit creation
- Unit management
- Unit retrieval
- Resident management
- Resident onboarding
- Unit assignment
- Resident status management
- Society membership validation
- Building and society relationship validation

## 4. Admin Management & Invitations

- Administrator management
- Resident invitations
- Invitation workflows
- Society membership
- Role assignment
- Membership status validation
- Active membership checks

## 5. Complaints & Maintenance

- Complaint creation
- Complaint categories
- Complaint priority
- Complaint status
- Complaint tracking
- Complaint assignment
- Maintenance dues
- Due-date tracking
- Unit-level maintenance information
- Society-level maintenance information
- Payment workflow
- Maintenance status

## 6. Announcements & Communication

- Announcement creation
- Announcement management
- Published announcements
- Announcement retrieval
- Society-level communication
- Resident announcement access
- Notification support

## 7. Meetings & Events

- Meeting creation
- Meeting scheduling
- Meeting retrieval
- Upcoming meetings
- Meeting status
- Meeting cancellation
- Society-level meeting access

## 8. Maintenance & Payments

- Maintenance due records
- Due dates
- Unit-level dues
- Society-level dues
- Payment workflow
- Payment status
- Demo payment support for development/testing
- Access control for maintenance information

## 9. AI Help Chatbot

SocietyOS includes an AI-assisted help experience.

The backend includes:

- AI provider abstraction
- Gemini integration
- AI conversation handling
- AI message handling
- AI-related API endpoints

---

# User Roles

SocietyOS uses role-based access control.

## Residents

Residents can access functionality appropriate to their society membership, including:

- Society information
- Unit information
- Announcements
- Complaints
- Maintenance information
- Meetings
- Notifications
- Profile management
- AI Help

Residents are restricted from administrator-only operations.

## Society Administrators

Society administrators can manage:

- Society structure
- Buildings
- Units
- Residents
- Invitations
- Complaints
- Maintenance
- Announcements
- Meetings

Administrator permissions are validated on the backend.

---

# Technology Stack

## Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- PostgreSQL
- Flyway
- Maven
- REST APIs
- Lombok

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

## Database

- PostgreSQL
- Flyway database migrations

## Development Tools

- IntelliJ IDEA
- VS Code
- Git
- GitHub
- Maven
- npm

## Deployment

- Vercel
- Render
- PostgreSQL on Render
- GitHub

---

# System Architecture

```text
                         ┌─────────────────────────┐
                         │       SocietyOS         │
                         │        Frontend         │
                         │   React + TypeScript    │
                         │          Vite           │
                         └────────────┬────────────┘
                                      │
                                      │ HTTPS / REST
                                      ▼
                         ┌─────────────────────────┐
                         │       SocietyOS         │
                         │        Backend          │
                         │   Spring Boot / Java    │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
             ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
             │  PostgreSQL  │  │ JWT / Spring │  │   Gemini AI  │
             │   Database   │  │   Security   │  │   Assistant  │
             └──────────────┘  └──────────────┘  └──────────────┘
Backend Architecture

The backend follows a layered architecture.

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
Controllers

Controllers handle HTTP requests and map them to application operations.

Services

Services contain the core business logic, validation, authorization checks, and transaction boundaries.

Repositories

Repositories provide database access through Spring Data JPA.

DTOs

DTOs define structured request and response models exchanged through the API.

Entities

Entities represent persistent domain models and their relationships.

Frontend Architecture
                React Application
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
     Pages         Components       Layouts
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                    Services
                       │
                       ▼
                   REST API
                       │
                       ▼
                Spring Boot API

The frontend contains dedicated areas for:

Application configuration
Components
Hooks
Layouts
Pages
Services
Types
Authentication
Admin workflows
Resident workflows
Authentication and Authorization

SocietyOS uses Spring Security and JWT-based authentication.

Authentication Flow
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
Authorization

Protected operations validate:

Authenticated user
Society membership
Membership status
User role
Society ownership
Building-society relationship
Unit-society relationship

Backend authorization prevents users from accessing resources belonging to another society.

Database

SocietyOS uses PostgreSQL as its primary relational database.

Database schema evolution is managed using Flyway.

Migration Areas
Identity
Society
Society members
Buildings
Units
Residents
Complaints
Announcements
Meetings
Maintenance dues
Notifications
AI conversations
Invitations
API Architecture

The frontend communicates with the backend using REST APIs.

Production API Base URL
https://societyos-63sh.onrender.com/api/v1
Major API Areas
Authentication
Users
Societies
Buildings
Units
Residents
Invitations
Complaints
Maintenance
Announcements
Meetings
Notifications
AI
Environment Configuration
Frontend Environment

Create:

frontend/.env
Local Development
VITE_API_URL=http://localhost:8080/api/v1
Production
VITE_API_URL=https://societyos-63sh.onrender.com/api/v1

The frontend API client reads the value through:

import.meta.env.VITE_API_URL

Do not commit private credentials or secrets to Git.

Project Structure
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
│   ├── Dockerfile
│   └── mvnw.cmd
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
Local Development Setup
Prerequisites
Java JDK
Maven
Node.js
npm
PostgreSQL
Git
Clone Repository
git clone https://github.com/Ankit-code02/societyos.git
cd societyos
Backend
cd backend
.\mvnw.cmd clean package
.\mvnw.cmd spring-boot:run

Backend:

http://localhost:8080
Frontend

Open another terminal:

cd frontend
npm install
npm run dev
Production Deployment

SocietyOS uses a separated frontend, backend, and database architecture.

                       Internet
                           │
                           ▼
                  ┌─────────────────┐
                  │     Vercel      │
                  │ React + Vite    │
                  └────────┬────────┘
                           │
                           │ HTTPS / REST API
                           ▼
                  ┌─────────────────┐
                  │     Render      │
                  │ Spring Boot API │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   PostgreSQL    │
                  │     Render      │
                  └─────────────────┘
Frontend

The frontend is deployed on Vercel.

Production API configuration:

VITE_API_URL=https://societyos-63sh.onrender.com/api/v1
Backend

The Spring Boot backend is deployed on Render.

https://societyos-63sh.onrender.com
Database

PostgreSQL is hosted through Render and connected to the backend.

Flyway manages database schema migrations.

Health Monitoring

Production health endpoint:

https://societyos-63sh.onrender.com/actuator/health

Expected healthy response:

{
  "status": "UP"
}
Security

Implemented security mechanisms include:

Spring Security
JWT authentication
Access tokens
Refresh tokens
OTP verification
Password reset
Protected API endpoints
Role-based authorization
Society membership authorization
Active membership validation
Protected frontend routes
Environment-based configuration
Secrets excluded from Git

Backend authorization checks prevent cross-society access.

Production Readiness

The project includes:

Layered backend architecture
REST APIs
Authentication
Authorization
Database migrations
Environment configuration
Frontend/backend separation
Cloud deployment
Health monitoring
Git-based version control
Structured domain modules
Current Project Status

SocietyOS has reached a deployed V1 state.

Completed
Authentication and user management
Society management
Society verification
Building management
Unit management
Resident management
Resident invitations
Complaints
Maintenance dues
Maintenance payment workflow
Announcements
Notifications
Meetings
AI Help
Role-based access control
PostgreSQL database
Flyway migrations
Production backend deployment
Production frontend deployment
Backend health monitoring
Deployment Status
Component	Platform	Status
Frontend	Vercel	Deployed
Backend	Render	Deployed
Database	PostgreSQL / Render	Available
Source Code	GitHub	Maintained
API Health	Spring Boot Actuator	UP
Future Improvements
Production payment gateway integration
Push notifications
Advanced society analytics
Financial reporting
Visitor management
Vendor management
Document management
Advanced AI automation
Mobile applications
Subscription and billing plans
Audit logging
Advanced administrator dashboards
Custom domains
Automated CI/CD pipelines
Automated testing pipelines
Performance monitoring
Centralized application logging
Error tracking and observability
Development Approach

SocietyOS is being developed as a production-oriented full-stack application rather than a basic CRUD project.

The development approach emphasizes:

Clear separation of concerns
Secure authentication
Backend-enforced authorization
Maintainable service architecture
Structured database migrations
Reusable frontend components
REST API design
Environment-based configuration
Cloud deployment
Practical real-world workflows
Incremental development
Version-controlled changes
Project Links
Live Application

Add the final Vercel production URL here after deployment.

https://your-vercel-domain.vercel.app
Backend
https://societyos-63sh.onrender.com
Backend Health
https://societyos-63sh.onrender.com/actuator/health
API Base URL
https://societyos-63sh.onrender.com/api/v1
GitHub Repository
https://github.com/Ankit-code02/societyos
Author
Ankit Maurya

GitHub:

https://github.com/Ankit-code02
License

This project is currently intended as a portfolio and development project.


Save this as:

**`D:\Projects\societyos\README.md`**
but i dont know how to arrange them so can you make it in one file so i use it

Download the complete README.md file 

societyos_README_complete.md
Document

Library
/
societyos_README_complete.md
SocietyOS

A production-oriented full-stack society management platform for residents, administrators, and society management teams.










Table of Contents
Overview
Problem Statement
Goals
Core Modules
Key Features
User Roles
Technology Stack
System Architecture
Backend Architecture
Frontend Architecture
Authentication and Authorization
Database
API Architecture
Project Structure
Environment Configuration
Local Development Setup
Production Deployment
Health Monitoring
Security
Current Project Status
Future Improvements
Development Approach
Project Links
Author
License
Overview

SocietyOS is a full-stack society management platform designed to centralize the everyday operations of residential societies.

Residential communities often rely on WhatsApp groups, spreadsheets, manual registers, phone calls, and disconnected processes to manage residents, complaints, maintenance, announcements, meetings, and society administration.

SocietyOS brings these workflows into one platform.

The application provides separate capabilities for residents and society administrators while enforcing authentication, authorization, society membership, and role-based access throughout the system.

Problem Statement

Residential societies commonly face several operational problems:

Resident information is maintained in spreadsheets.
Complaints are raised through informal communication channels.
Maintenance dues are tracked manually.
Important announcements can get lost in chat groups.
Meeting information is distributed across different channels.
Resident onboarding can be manual and difficult to track.
Society administrators have limited centralized visibility.
Society information is distributed across multiple tools.

SocietyOS addresses these problems by providing a centralized digital platform for society operations.

Goals
Centralize society management workflows.
Provide secure authentication and authorization.
Provide structured resident and unit management.
Simplify complaint and maintenance management.
Improve society-wide communication.
Provide structured meeting management.
Support society verification and onboarding.
Provide AI-assisted help for common society-related questions.
Maintain a scalable backend architecture.
Provide a deployable production-oriented application.
Core Modules

SocietyOS V1 is organized around the following core modules:

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
1. Authentication & User Management
User registration
User login
OTP verification
Password reset
JWT-based authentication
Access tokens
Refresh tokens
Protected API endpoints
Protected frontend routes
User profile management
Role-based authorization
2. Society & Building Management
Society registration
Society onboarding
Society verification
Society status management
Building management
Building creation
Building retrieval
Society membership management
Society-level authorization
3. Unit & Resident Management
Unit creation
Unit management
Unit retrieval
Resident management
Resident onboarding
Unit assignment
Resident status management
Society membership validation
Building and society relationship validation
4. Admin Management & Invitations
Administrator management
Resident invitations
Invitation workflows
Society membership
Role assignment
Membership status validation
Active membership checks
5. Complaints & Maintenance
Complaint creation
Complaint categories
Complaint priority
Complaint status
Complaint tracking
Complaint assignment
Maintenance dues
Due-date tracking
Unit-level maintenance information
Society-level maintenance information
Payment workflow
Maintenance status
6. Announcements & Communication
Announcement creation
Announcement management
Published announcements
Announcement retrieval
Society-level communication
Resident announcement access
Notification support
7. Meetings & Events
Meeting creation
Meeting scheduling
Meeting retrieval
Upcoming meetings
Meeting status
Meeting cancellation
Society-level meeting access
8. Maintenance & Payments
Maintenance due records
Due dates
Unit-level dues
Society-level dues
Payment workflow
Payment status
Demo payment support for development/testing
Access control for maintenance information
9. AI Help Chatbot

SocietyOS includes an AI-assisted help experience.

The backend includes:

AI provider abstraction
Gemini integration
AI conversation handling
AI message handling
AI-related API endpoints
User Roles

SocietyOS uses role-based access control.

Residents

Residents can access functionality appropriate to their society membership, including:

Society information
Unit information
Announcements
Complaints
Maintenance information
Meetings
Notifications
Profile management
AI Help

Residents are restricted from administrator-only operations.

Society Administrators

Society administrators can manage:

Society structure
Buildings
Units
Residents
Invitations
Complaints
Maintenance
Announcements
Meetings

Administrator permissions are validated on the backend.

Technology Stack
Backend
Java
Spring Boot
Spring Security
JWT Authentication
Spring Data JPA
Hibernate
PostgreSQL
Flyway
Maven
REST APIs
Lombok
Frontend
React
TypeScript
Vite
Axios
React Router
CSS
AI
Gemini
AI provider abstraction
Database
PostgreSQL
Flyway database migrations
Development Tools
IntelliJ IDEA
VS Code
Git
GitHub
Maven
npm
Deployment
Vercel
Render
PostgreSQL on Render
GitHub
System Architecture
                         ┌─────────────────────────┐
                         │       SocietyOS         │
                         │        Frontend         │
                         │   React + TypeScript    │
                         │          Vite           │
                         └────────────┬────────────┘
                                      │
                                      │ HTTPS / REST
                                      ▼
                         ┌─────────────────────────┐
                         │       SocietyOS         │
                         │        Backend          │
                         │   Spring Boot / Java    │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
             ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
             │  PostgreSQL  │  │ JWT / Spring │  │   Gemini AI  │
             │   Database   │  │   Security   │  │   Assistant  │
             └──────────────┘  └──────────────┘  └──────────────┘
Backend Architecture

The backend follows a layered architecture.

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
Controllers

Controllers handle HTTP requests and map them to application operations.

Services

Services contain the core business logic, validation, authorization checks, and transaction boundaries.

Repositories

Repositories provide database access through Spring Data JPA.

DTOs

DTOs define structured request and response models exchanged through the API.

Entities

Entities represent persistent domain models and their relationships.

Frontend Architecture
                React Application
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
     Pages         Components       Layouts
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                    Services
                       │
                       ▼
                   REST API
                       │
                       ▼
                Spring Boot API

The frontend contains dedicated areas for:

Application configuration
Components
Hooks
Layouts
Pages
Services
Types
Authentication
Admin workflows
Resident workflows
Authentication and Authorization

SocietyOS uses Spring Security and JWT-based authentication.

Authentication Flow
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
Authorization

Protected operations validate:

Authenticated user
Society membership
Membership status
User role
Society ownership
Building-society relationship
Unit-society relationship

Backend authorization prevents users from accessing resources belonging to another society.

Database

SocietyOS uses PostgreSQL as its primary relational database.

Database schema evolution is managed using Flyway.

Migration Areas
Identity
Society
Society members
Buildings
Units
Residents
Complaints
Announcements
Meetings
Maintenance dues
Notifications
AI conversations
Invitations
API Architecture

The frontend communicates with the backend using REST APIs.

Production API Base URL
https://societyos-63sh.onrender.com/api/v1
Major API Areas
Authentication
Users
Societies
Buildings
Units
Residents
Invitations
Complaints
Maintenance
Announcements
Meetings
Notifications
AI
Environment Configuration
Frontend Environment

Create:

frontend/.env
Local Development
VITE_API_URL=http://localhost:8080/api/v1
Production
VITE_API_URL=https://societyos-63sh.onrender.com/api/v1

The frontend API client reads the value through:

import.meta.env.VITE_API_URL

Do not commit private credentials or secrets to Git.

Project Structure
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
│   ├── Dockerfile
│   └── mvnw.cmd
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
Local Development Setup
Prerequisites
Java JDK
Maven
Node.js
npm
PostgreSQL
Git
Clone Repository
git clone https://github.com/Ankit-code02/societyos.git
cd societyos
Backend
cd backend
.\mvnw.cmd clean package
.\mvnw.cmd spring-boot:run

Backend:

http://localhost:8080
Frontend

Open another terminal:

cd frontend
npm install
npm run dev
Production Deployment

SocietyOS uses a separated frontend, backend, and database architecture.

                       Internet
                           │
                           ▼
                  ┌─────────────────┐
                  │     Vercel      │
                  │ React + Vite    │
                  └────────┬────────┘
                           │
                           │ HTTPS / REST API
                           ▼
                  ┌─────────────────┐
                  │     Render      │
                  │ Spring Boot API │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   PostgreSQL    │
                  │     Render      │
                  └─────────────────┘
Frontend

The frontend is deployed on Vercel.

Production API configuration:

VITE_API_URL=https://societyos-63sh.onrender.com/api/v1
Backend

The Spring Boot backend is deployed on Render.

https://societyos-63sh.onrender.com
Database

PostgreSQL is hosted through Render and connected to the backend.

Flyway manages database schema migrations.

Health Monitoring

Production health endpoint:

https://societyos-63sh.onrender.com/actuator/health

Expected healthy response:

{
  "status": "UP"
}
Security

Implemented security mechanisms include:

Spring Security
JWT authentication
Access tokens
Refresh tokens
OTP verification
Password reset
Protected API endpoints
Role-based authorization
Society membership authorization
Active membership validation
Protected frontend routes
Environment-based configuration
Secrets excluded from Git

Backend authorization checks prevent cross-society access.

Production Readiness

The project includes:

Layered backend architecture
REST APIs
Authentication
Authorization
Database migrations
Environment configuration
Frontend/backend separation
Cloud deployment
Health monitoring
Git-based version control
Structured domain modules
Current Project Status

SocietyOS has reached a deployed V1 state.

Completed
Authentication and user management
Society management
Society verification
Building management
Unit management
Resident management
Resident invitations
Complaints
Maintenance dues
Maintenance payment workflow
Announcements
Notifications
Meetings
AI Help
Role-based access control
PostgreSQL database
Flyway migrations
Production backend deployment
Production frontend deployment
Backend health monitoring
Deployment Status
Component	Platform	Status
Frontend	Vercel	Deployed
Backend	Render	Deployed
Database	PostgreSQL / Render	Available
Source Code	GitHub	Maintained
API Health	Spring Boot Actuator	UP
Future Improvements
Production payment gateway integration
Push notifications
Advanced society analytics
Financial reporting
Visitor management
Vendor management
Document management
Advanced AI automation
Mobile applications
Subscription and billing plans
Audit logging
Advanced administrator dashboards
Custom domains
Automated CI/CD pipelines
Automated testing pipelines
Performance monitoring
Centralized application logging
Error tracking and observability
Development Approach

SocietyOS is being developed as a production-oriented full-stack application rather than a basic CRUD project.

The development approach emphasizes:

Clear separation of concerns
Secure authentication
Backend-enforced authorization
Maintainable service architecture
Structured database migrations
Reusable frontend components
REST API design
Environment-based configuration
Cloud deployment
Practical real-world workflows
Incremental development
Version-controlled changes
Project Links
Live Application

Add the final Vercel production URL here after deployment.

https://your-vercel-domain.vercel.app
Backend
https://societyos-63sh.onrender.com
Backend Health
https://societyos-63sh.onrender.com/actuator/health
API Base URL
https://societyos-63sh.onrender.com/api/v1
GitHub Repository
https://github.com/Ankit-code02/societyos
Author
Ankit Maurya

GitHub:

https://github.com/Ankit-code02
License

This project is currently intended as a portfolio and development project.