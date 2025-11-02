# Syntax E-Commerce Admin Dashboard 🎛️

A powerful, secure admin dashboard for managing e-commerce operations. Built with Next.js 15, React 19, and TypeScript 5. Features comprehensive product management, order tracking, user administration, and real-time analytics.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **UI Library:** React 19.1.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **HTTP Client:** Axios 1.12.2
- **Validation:** Zod 4.1.12
- **Icons:** Lucide React 0.548.0
- **Notifications:** React Hot Toast 2.6.0
- **Desktop Support:** Tauri 2.9 (optional)

---

## ✨ Features

### 📊 Dashboard & Analytics

- **Real-Time Statistics:** Total users, products, orders, and revenue
- **Recent Orders:** Quick view of the 10 newest orders
- **Revenue Tracking:** Comprehensive financial overview
- **Quick Actions:** Direct access to all management modules

### 🛍️ Product Management

- **Product Catalog:** View, create, edit, and delete products
- **Category Management:** Organize products into categories
- **Featured Products:** Highlight products on the homepage
- **Stock Management:** Track inventory levels
- **Image Upload:** Product image management
- **Bulk Operations:** Efficient multi-product management

### 📦 Order Management

- **Order Overview:** View all customer orders with status
- **Order Details:** Detailed view of order items and customer info
- **Status Updates:** Change order status (pending, processing, shipped, delivered)
- **Order Search:** Filter and search orders by various criteria
- **Test Orders:** Separate testing environment for development

### 👥 User Management

- **User Directory:** View all registered customers
- **User Details:** Access to user information and order history
- **Account Control:** Ban/unban user accounts
- **Role Management:** Admin access control

### 🎨 Content Management

- **Featured Products:** Manage homepage featured items
- **Category Organization:** Create and manage product categories
- **Visual Hierarchy:** Control product display priority

### 🔐 Security & Authentication

- **Desktop Grant Authentication:** OAuth2-style desktop grant flow with JWT access tokens
- **Dual Auth Modes:** Bearer tokens (desktop) + httpOnly cookies (web fallback)
- **CSRF Protection:** Double-submit cookie pattern for state-changing requests
- **Role-Based Access:** Admin-only routes with role verification
- **Automatic Token Refresh:** Seamless session management
- **Secure Storage:** Tauri keystore for desktop, httpOnly cookies for web

---

## 📁 Project Structure

```
ecommerce-admin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Login page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── products/           # Product management
│   │   ├── categories/         # Category management
│   │   ├── orders/             # Order management
│   │   ├── test-orders/        # Test order viewing
│   │   ├── users/              # User management
│   │   └── featured/           # Featured products
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/               # Admin authentication
│   │   │   ├── components/     # Login, AuthGuard
│   │   │   ├── context/        # AdminAuthProvider
│   │   │   └── types.ts        # Auth types
│   │   │
│   │   ├── components/         # Shared feature components
│   │   │   ├── CategoryManager.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── FeaturedManager.tsx
│   │   │   ├── OrderManager.tsx
│   │   │   ├── ProductManager.tsx
│   │   │   ├── TestOrderManager.tsx
│   │   │   └── UserManager.tsx
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   ├── data.ts             # API data fetching
│   │   ├── types.ts            # Shared types
│   │   └── index.ts            # Feature exports
│   │
│   └── shared/                 # Shared resources
│       ├── components/         # Reusable UI components
│       │   ├── Sidebar.tsx     # Navigation sidebar
│       │   └── Toast.tsx       # Notification system
│       │
│       ├── context/            # Global state providers
│       │   └── GlobalProvider.tsx
│       │
│       ├── lib/                # Core utilities
│       │   ├── api.ts          # Admin API client
│       │   ├── tauriKeystore.ts # Secure storage (Tauri)
│       │   └── utils.ts        # Helper functions
│       │
│       └── ui/                 # UI primitives
│           └── button/         # Button components
│
├── src-tauri/                  # Tauri desktop app (optional)
│   ├── src/
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── public/                     # Static assets
│   └── Company_Logo.png
│
├── .env.local.example          # Environment variable template
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js:** v20 or higher
- **npm:** v10 or higher
- **Backend:** The [ecommerce-backend](../ecommerce-backend) must be running
- **Admin Account:** You need admin credentials to access the dashboard

### Installation

1. **Clone the repository:**

   ```bash
   cd ecommerce-admin
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit `.env.local` with your configuration:**

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:8001/api/v1/auth
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**

   ```
   http://localhost:3002
   ```

7. **Login with admin credentials:**
   - Use the admin account created in the backend setup

---

## 📜 Available Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server on port 3002 |
| `npm run build` | Build production-ready application    |
| `npm start`     | Start production server on port 3002  |
| `npm run lint`  | Run ESLint for code quality           |
| `npm run tauri` | Run Tauri desktop app (optional)      |

---

## 🔌 API Integration

### Admin API Client

The admin dashboard uses a specialized API client with admin authentication:

```typescript
// All API calls include admin JWT token
Client → /api/admin/* → http://localhost:8000/api/v1/admin/*
```

### Protected Routes

All admin routes require authentication:

- **Dashboard:** `/dashboard`
- **Products:** `/products`
- **Categories:** `/categories`
- **Orders:** `/orders`
- **Users:** `/users`
- **Featured:** `/featured`

### API Authentication

- **Grant Type:** `desktop` grant type for OAuth2-style flow
- **Access Token:** JWT access token returned in response body
- **Token Delivery:** Bearer token in `Authorization` header
- **Token Storage:** Tauri keystore (desktop) or localStorage fallback (web)
- **Token Refresh:** Automatic renewal before expiration
- **CSRF Protection:** Double-submit cookie pattern for state changes

---

## 🔐 Authentication Flow

### Desktop Grant Flow (Primary)

1. **Admin Login:** Credentials + `grant_type: "desktop"` sent to `/auth/login`
2. **Token Response:** Backend returns `accessToken` and user object
3. **Role Verification:** Client validates user has `admin` role
4. **Secure Storage:** Token stored in Tauri keystore (encrypted)
5. **Token Injection:** Bearer token sent in `Authorization` header for all requests
6. **Auto Refresh:** Token refreshed automatically before expiration

### Web Fallback (Cookie-based)

1. **Admin Login:** Standard credentials to `/auth/login`
2. **Cookie Storage:** Backend sets httpOnly cookies
3. **Automatic Inclusion:** Cookies sent with every request
4. **CSRF Protection:** Double-submit token pattern
5. **Route Protection:** All dashboard pages require valid session

### Key Differences

- **Desktop Mode:** Explicit JWT access tokens in Authorization header
- **Web Mode:** Implicit httpOnly cookies with credentials
- **Storage:** Tauri keystore vs browser cookies
- **Security:** Both modes use CSRF protection and role validation

---

## 📊 Dashboard Features

### Statistics Overview

- **Total Users:** Count of registered customers
- **Total Products:** Inventory count
- **Total Categories:** Product organization
- **Total Orders:** All-time orders placed
- **Total Revenue:** Sum of all completed orders

### Recent Activity

- **Newest Orders:** Real-time order feed
- **Quick Actions:** One-click navigation to management sections

---

## 🛍️ Product Management

### Features

- **Create Products:** Add new items with details and images
- **Edit Products:** Update product information
- **Delete Products:** Remove discontinued items
- **Category Assignment:** Organize products
- **Stock Levels:** Track inventory
- **Price Management:** Set product pricing

### Product Fields

- Name
- Description
- Price
- Stock quantity
- Category
- Featured status
- Image URL

---

## 📦 Order Management

### Order Statuses

- **Pending:** Order received, awaiting processing
- **Processing:** Order being prepared
- **Shipped:** Order in transit
- **Delivered:** Order completed
- **Cancelled:** Order cancelled

### Order Details

- Order ID and date
- Customer information
- Product items with quantities
- Total amount
- Status history
- Payment information

---

## 👥 User Management

### User Operations

- **View Users:** List all registered customers
- **User Details:** Access full user profile
- **Ban/Unban:** Control account access
- **Order History:** View user's purchase history

### User Information

- User ID
- Email address
- Registration date
- Total orders
- Account status (active/banned)

---

## 🎨 Styling

### Tailwind CSS 4

- **Admin Theme:** Professional dashboard design
- **Responsive Layout:** Works on all devices
- **Dark Sidebar:** Clean navigation
- **Consistent Spacing:** 4px grid system
- **Status Colors:** Visual order status indicators

### Design System

- **Colors:** Amber/Yellow accents, Zinc grayscale
- **Typography:** Inter font family
- **Components:** Reusable button, card, and table styles
- **Icons:** Lucide React icon library

---

## 🔧 Environment Variables

| Variable                      | Purpose              | Example                             |
| ----------------------------- | -------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`    | Backend API base URL | `http://localhost:8000/api/v1`      |
| `NEXT_PUBLIC_AUTH_SERVER_URL` | Auth server URL      | `http://localhost:8001/api/v1/auth` |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deployment Checklist

1. **Environment Variables:** Set production API URLs
2. **Admin Credentials:** Ensure admin account exists in backend
3. **Security:** Verify HTTPS for production
4. **CORS:** Configure backend to allow admin domain
5. **Port Configuration:** Admin runs on port 3002 by default

### Vercel Deployment

1. **Connect Repository:**

   - Import project to Vercel
   - Connect GitHub repository

2. **Configure Environment Variables:**

   - Add all `.env.local` variables to Vercel
   - Set production URLs for backend

3. **Deploy:**
   ```bash
   vercel --prod
   ```

---

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot connect to backend"**

- Ensure backend is running on port 8000/8001
- Check `.env.local` URLs are correct
- Verify admin endpoints are accessible

**2. "Authentication failed"**

- Verify admin credentials are correct
- Check that user has `admin` role in database
- Ensure backend accepts `grant_type: "desktop"` parameter
- Clear Tauri keystore or browser storage and try again

**3. "Unauthorized access"**

- Ensure JWT access token is valid and not expired
- Check that Bearer token is being sent in Authorization header
- Verify admin role permissions in backend
- Check CSRF token is being sent for state-changing requests

**4. "Build errors"**

- Run `npm install` to update dependencies
- Delete `.next` folder and rebuild
- Check for TypeScript errors with `npm run lint`

**5. "API calls failing"**

- Verify backend is running and accessible
- Check network tab for error responses
- Ensure API routes match backend endpoints

---

## 🔒 Security Best Practices

- **Desktop Grant Flow:** OAuth2-style authentication with explicit access tokens
- **Admin Role Verification:** Client and server validate admin role
- **CSRF Protection:** Prevent cross-site request forgery attacks
- **Input Validation:** Zod schemas validate all user inputs
- **Secure Token Storage:** Tauri keystore (encrypted) or httpOnly cookies
- **Bearer Token Auth:** Explicit Authorization header prevents CSRF on tokens
- **Password Security:** Never store passwords client-side
- **Audit Logging:** Track admin actions (backend)

---

## 📝 Code Style

- **TypeScript:** Strict mode enabled
- **ESLint:** Next.js recommended config
- **Formatting:** Consistent spacing and indentation
- **Naming:** camelCase for variables, PascalCase for components
- **Comments:** Clear, concise explanations for complex logic
- **Error Handling:** Comprehensive try-catch blocks

---

## 🔗 Related Repositories

- **Backend API:** [ecommerce-backend](../ecommerce-backend)
- **Customer Frontend:** [ecommerce-frontend](../ecommerce-frontend)

---

## 📄 License

Private project for educational purposes.

---

## 👥 Team

**Justin Sturm**

- **GitHub** - [GitHub](https://github.com/JustinCCodes)
- **LinkedIn**: [LinkedIn](https://www.linkedin.com/in/sturmjustin/)

---

**Built with ❤️ for efficient e-commerce management**
