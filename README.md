<div align="center">

# 🏪 Ma Kali Vandar (Grocery Ledger & Inventory)

### Modern Shop Management Platform · Customer Khata Book · Product Inventory Manager

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Ma_Kali_Vandar-6366f1?style=for-the-badge)](https://ma-kali-vander-our-shop-5qlp.vercel.app)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)

**Ma Kali Vandar** is a premium, full-stack shop management system featuring a digital **Khata (Credit Ledger) Book** and a **Product Inventory Manager**. Designed for local grocery owners, it simplifies tracking client credits (Baki), logging repayments, managing products with real-time stock counts, and securing accounts using multi-role authentication.

*Dual Auth Modes (Firebase & JWT) · Credit & Debit Tracking · Cloudinary Storage · Winston Logger · Optimized for Vercel*

</div>

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📓 **Customer Khata Book** | Track customers' credit (debit) and payments (credit) with automatic calculation of outstanding balance (`totalBaki`). |
| 📦 **Inventory Manager** | Organize products with name, price, category, unit, stock, and high-quality images. |
| 🔐 **Role-Based Access** | Restrict adding, editing, or deleting products and ledger transactions to **Admin** only. Standard users get view-only privileges. |
| 🔑 **Dual Authentication** | Secure access with either traditional Email/Password (JWT) or Google One-Tap/Federated sign-in powered by Firebase Auth. |
| 🖼️ **Cloudinary Uploads** | Direct, optimized image uploads with automatic sizing, compression, and cropping using Multer & Cloudinary Storage. |
| 🛡️ **Production-Ready Security** | Implements Helmet, Mongo-Sanitization, CORS policy controls, and distinct Rate-Limiters for auth, standard API, and media uploads. |
| 📊 **Admin Dashboard** | Get visual and quantitative insights with total store dues, customer counts, and product analytics. |
| 🎨 **Premium UI/UX** | Cream theme with a glassmorphism sidebar, dark/light hints, responsive layouts, and smooth micro-interactions powered by Framer Motion. |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚛️ **Frontend UI** | React 18 & Vite |
| 🟢 **Backend API** | Express (Node.js) |
| 💾 **Database** | MongoDB Atlas via Mongoose ODM |
| 🎨 **Styling** | Tailwind CSS |
| ✨ **Animations** | Framer Motion |
| 🔐 **Authentication** | JSON Web Tokens (JWT) + Firebase Admin SDK |
| ☁️ **Media Cloud** | Cloudinary CDN via Multer Storage |
| 🪵 **Logging** | Winston (structured logger) & Morgan (HTTP req stream) |
| 🚀 **Hosting** | Vercel (Frontend) & Web Host (Backend) |

---

## 📂 Project Structure

```
Ma_Kali_Vander_Our_shop/
├── Backend/
│   ├── src/
│   │   ├── config/          # DB connection & Firebase Admin setup
│   │   ├── controllers/     # Route business logic (auth, khata, product, user)
│   │   ├── middleware/      # Authentication, role validation & error handlers
│   │   ├── models/          # MongoDB schemas (User, Khata, Product)
│   │   ├── routes/          # Express API route endpoints
│   │   ├── services/        # Third-party adapters
│   │   ├── utils/           # Joi validators & Winston Logger
│   │   └── app.js           # Express main server configuration
│   ├── server.js            # Server bootloader & startup/shutdown guards
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables file
│
├── Frontend/
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── assets/          # Shared image assets & logos
│   │   ├── components/      # Common UI elements (Sidebar, modals, cards)
│   │   ├── context/         # Auth & global state providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Application views (Dashboard, Auth, Khata, Products)
│   │   ├── routes/          # Private and Admin routing guards
│   │   ├── services/        # Axios API clients & firebase setup
│   │   ├── index.css        # Tailwind global styling configuration
│   │   └── main.jsx         # Client React entrypoint
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind rules & theme customization
│   └── vite.config.js       # Vite configuration
│
└── README.md                # Documentation (this file)
```

---

## 💾 Database Schemas

### 1. `Khata` Model
Manages individual customer credits. Contains nested transactions representing debits (credit purchases) and credits (repayments).
```javascript
{
  customerName: { type: String, required: true },
  phone:        { type: String, default: "" },
  address:      { type: String, default: "" },
  totalBaki:    { type: Number, default: 0 },
  transactions: [{
    type:      { type: String, enum: ['debit', 'credit'] }, // debit=purchased on credit, credit=paid back
    amount:    { type: Number, required: true },
    note:      { type: String, default: "" },
    date:      { type: Date, default: Date.now },
    createdBy: { type: ObjectId, ref: 'User' }
  }],
  isActive:     { type: Boolean, default: true },
  createdBy:    { type: ObjectId, ref: 'User' }
}
```

### 2. `Product` Model
Tracks physical store products and inventory.
```javascript
{
  name:     { type: String, required: true },
  category: { type: String, default: 'General' },
  price:    { type: Number, required: true },
  stock:    { type: Number, default: 0 },
  unit:     { type: String, default: 'kg' },
  isActive: { type: Boolean, default: true },
  image: {
    url:      { type: String, default: '' },
    publicId: { type: String, default: '' }
  }
}
```

---

## ⚡ API Endpoints

### 🔑 Authentication
* `POST /api/auth/register` - Create a traditional credentials account.
* `POST /api/auth/login` - Authenticate traditional credentials (returns JWT).
* `POST /api/auth/firebase` - Authenticate/Sync Firebase Google users.
* `GET /api/auth/me` - Fetch authenticated user details.
* `PUT /api/auth/change-password` - Update password.

### 📓 Ledger (Khata)
* `GET /api/khata` - Get all customer ledgers.
* `POST /api/khata` - Create new customer ledger *(Admin Only)*.
* `GET /api/khata/stats` - Fetch aggregate outstanding statistics *(Admin Only)*.
* `GET /api/khata/:id` - Fetch single customer details with full transactions.
* `PUT /api/khata/:id` - Update customer info *(Admin Only)*.
* `DELETE /api/khata/:id` - Deactivate customer ledger *(Admin Only)*.
* `POST /api/khata/:id/transaction` - Append transaction (Credit/Debit) *(Admin Only)*.
* `DELETE /api/khata/:id/transaction/:txId` - Remove transaction *(Admin Only)*.

### 📦 Products & Inventory
* `GET /api/products` - Retrieve list of products with filters.
* `GET /api/products/categories` - Fetch unique categories list.
* `POST /api/products` - Create new product with image *(Admin Only)*.
* `PUT /api/products/:id` - Update product attributes *(Admin Only)*.
* `DELETE /api/products/:id` - Remove/Deactivate product *(Admin Only)*.

### 🖼️ Uploads
* `POST /api/upload/image` - Direct multipart upload to Cloudinary.

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js** v18+ and **npm** v9+
* **MongoDB** (Local instance or MongoDB Atlas cluster URI)
* **Cloudinary Account** (for product images)
* **Firebase Project** (optional, required if enabling Google Login)

---

### Setup Instructions

#### 1. Clone the repository
```bash
git clone https://github.com/ParthaG23/Ma_Kali_Vander_Our_shop.git
cd Ma_Kali_Vander_Our_shop
```

#### 2. Configuration (`.env`)

Create a `.env` file in the **`Backend`** folder:
```env
# Server Configuration
NODE_ENV=development
PORT=8000

# Database
MONGO_URI=your_mongodb_uri

# JWT Authentication
JWT_SECRET=your_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d

# CORS Policy
CLIENT_ORIGINS=http://localhost:5173

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Firebase Admin SDK (Optional - for Google Login)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"
```

Create a `.env` file in the **`Frontend`** folder:
```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api

# Firebase Web App Config (Optional)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

#### 3. Install & Launch (Development)

##### Run Backend:
```bash
cd Backend
npm install
npm run dev
```
Backend runs at → **http://localhost:8000**

##### Run Frontend:
```bash
cd ../Frontend
npm install
npm run dev
```
Frontend runs at → **http://localhost:5173**

---

## 🚀 Deployment

### Backend Production
To prepare and run the production server:
```bash
cd Backend
NODE_ENV=production npm start
```

### Frontend Production
To build the static files:
```bash
cd Frontend
npm run build
```
Deploy the generated `dist/` directory to **Vercel**, **Netlify**, or **GitHub Pages**. (A `vercel.json` file is already supplied in the Frontend directory for instant, SPA-friendly routing deployment).

---

## 🏗️ Architecture

```mermaid
graph TD
  A[React Frontend] -->|HTTP Requests| B[Express Gateway App]
  B -->|Rate Limit / Helmet / CORS| C{Auth Middleware}
  C -->|Failed Auth| D[401 Unauthorized]
  C -->|Passed Auth| E[Role Authorization]
  E -->|Is Admin| F[Admin Controllers]
  E -->|Is User| G[User View Controllers]
  F -->|Write / Update| H[(MongoDB Atlas)]
  G -->|Read Only| H
  F -->|Upload Stream| I[Cloudinary CDN]
```

---

## 🛡️ Security & Performance Standards

* **Layered Rate-Limiting**:
  * Auth routes are limited to 20 requests per 15 minutes to counter brute-force attempts.
  * Uploads are limited to 50 requests per 15 minutes to conserve cloud storage resource bandwidth.
  * Standard API requests are limited to 300 per 15 minutes.
* **Payload Sanitation**: `express-mongo-sanitize` scrubs user payloads to eliminate SQL/NoSQL injection vectors.
* **HTTP Hardening**: Helmet middleware sets HTTP headers to guard against clickjacking, XSS, and sniff attacks.
* **Compression**: Server responds with GZIP compressed bodies to enhance transmission speed and reduce network usage.
* **Graceful Shutdown**: Intercepts `SIGTERM` and `SIGINT` to close open connections, wait for active transactions, and shut down cleanly.

---

## 🧑‍💻 Author

**Partha Gayen**

[![GitHub](https://img.shields.io/badge/GitHub-ParthaG23-181717?style=flat-square&logo=github)](https://github.com/ParthaG23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Partha_Gayen-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/partha-gayen)

---

## 📜 License

This project is licensed under the **ISC License**.

---

<div align="center">
  <br />
  <strong>🏪 Ma Kali Vandar</strong> · Ledger and inventory made simple.
  <br />
  <sub>Built with ❤️ using MongoDB, Express, React, Node.js & Framer Motion</sub>
</div>
