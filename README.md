# 🏢 SMR Groups Billing System

<p align="center">
  <strong>An advanced, multi-tenant billing and inventory management solution engineered for SMR Trading and Company.</strong>
</p>

---

## 📖 Overview

The **SMR Groups Billing System** is an enterprise-grade, high-performance web application designed to streamline point-of-sale, inventory tracking, quotation generation, and comprehensive financial reporting. 

Engineered with a robust multi-tenant architecture and a highly polished "classic" reporting user interface, the system seamlessly interfaces with both local databases for ultra-low latency and cloud-native environments for secure remote backups.

## ✨ Key Features

- **🛡️ Secure Multi-Tenant Architecture**: Operates on a highly scalable multi-database model using SQLite. Each tenant (client/business entity) maintains full data isolation via dedicated `billing_tenant_<hash>.sqlite` vaults.
- **☁️ Cloud Synchronization Engine**: Features a proprietary real-time backup mechanism that securely replicates on-premise SQLite databases into isolated schemas on a highly-available **Neon PostgreSQL** cluster.
- **📊 Professional Reporting & Quotations**: 
  - Dynamic generation of Purchase Statements, Sales Statements, and GST Reports.
  - Pixel-perfect, coordinate-aligned Print Layouts engineered specifically for SMR Trading and Company's pre-printed physical stationery.
- **📦 Comprehensive Inventory & WEG Stock**: Advanced item master configuration, automated low-stock thresholds, and precise tracking of WEG Electric Motors (HP, RPM, Poles, Phase, Frame).
- **💼 End-to-End Accounting**: Full lifecycle management of Customers, Suppliers, Sales Executives, Company Staff, and Daily Expenses.
- **🎨 Glassmorphism & Premium UI**: Features a sleek, modern, and highly responsive user interface combining professional basic styling with fluid micro-animations.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React 18 / Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Custom Design System featuring Glassmorphism and classic red-bordered print utilities)
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend Architecture
- **Framework**: Node.js / Express.js
- **Language**: TypeScript
- **Primary Datastore**: SQLite3 (Multi-tenant file separation)
- **Cloud Backup Datastore**: Neon Database (Serverless PostgreSQL)
- **Authentication**: Custom scrypt-based password hashing and tokenized sessions

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Installation
Clone the repository and install dependencies for both the frontend and backend microservices:

```bash
git clone https://github.com/puspharajm2003/ps-billing.git
cd ps-billing

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory to configure the Cloud Backup engine:

```env
# backend/.env
PORT=5000
NEON_DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require&channel_binding=require
```

### 3. Running the Application

**Start the Backend Server (Port 5000):**
```bash
cd backend
npm run dev
```

**Start the Frontend Development Server:**
```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:5173` in your browser to access the system.

---

## 🔒 Security Posture

- **No Hardcoded Secrets**: All database connection strings and sensitive credentials are encrypted and securely injected via environment variables.
- **Path Traversal Mitigation**: Implements strict `path.normalize` and boundaries validation when accessing tenant-specific file clusters.
- **Object Injection Defenses**: Safely utilizes strict prototype-agnostic checks during database synchronization loops.

---

## 🤝 Contribution Guidelines
This is a proprietary application built for SMR Groups. Authorized developers can contribute by submitting feature requests or pull requests to the `main` branch. 

*Engineered with precision for professional billing and inventory operations.*
