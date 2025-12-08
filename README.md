# Syntax E-Commerce Admin Dashboard 🎛️

A powerful, secure admin dashboard for managing e-commerce operations. Built with Next.js 15, React 19, and TypeScript 5. Features comprehensive product management, order tracking, user administration, and real-time analytics. Includes optional Tauri 2.9 desktop packaging for enhanced security and performance.

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

## ✨ Key Features

### 📊 Dashboard & Analytics

- **Real-Time Statistics:** Total users, products, orders, and revenue
- **Recent Orders:** Quick view of the 10 newest orders
- **Low Stock Alerts:** Visual warnings for products needing restock
- **Quick Navigation:** One-click access to all management sections

### 🛍️ Product Management

- **Full CRUD:** Create, read, update, and delete products
- **Stock Editor:** Dedicated inline stock management with color-coded warnings
- **Image Upload:** Direct Cloudinary integration with preview
- **Category Assignment:** Dropdown selection with validation
- **Featured Status:** Toggle products for homepage display
- **Draft System:** Auto-save unsaved products (max 10 drafts)
- **Advanced Filtering:** Search by name, filter by category, sort by multiple criteria

### 📦 Order Management

- **Order Overview:** View all customer orders with status badges
- **Order Details Modal:** Detailed view of order items and customer info
- **Status Updates:** Change order status with confirmation
- **Advanced Filtering:** Search by ID, filter by status, date range, sort options
- **Revenue Tracking:** Real-time filtered revenue calculation

### 👥 User Management

- **User Directory:** View all registered customers with pagination
- **User Search:** Filter by name, email, or ID
- **Account Control:** Ban/unban accounts with reason and optional expiry
- **Role Management:** Promote users to admin with confirmation
- **User Status Badges:** Visual indicators for banned/active users

### 🗂️ Category Management

- **Full CRUD:** Create, read, update, and delete categories
- **Creator Tracking:** See who created each category
- **Product Count:** Track products per category
- **Search & Sort:** Filter by name or creation date

### 🎨 Featured Products Management

- **Featured Grid:** Card-based layout for featured products
- **Toggle Featured:** Mark/unmark products as featured
- **Pagination:** Navigate through featured products
- **Empty State:** Clear messaging when no featured products

### 🔐 Security & Authentication

- **Desktop Grant Authentication:** OAuth2-style desktop grant flow with JWT access tokens
- **Dual Auth Modes:** Bearer tokens (desktop) + httpOnly cookies (web fallback)
- **CSRF Protection:** Double-submit cookie pattern for state-changing requests
- **Role-Based Access:** Admin-only routes with role verification
- **Automatic Token Refresh:** Seamless session management
- **Secure Storage:** Tauri keystore for desktop, httpOnly cookies for web

### 🎨 User Experience

- **Light/Dark Mode:** Toggle between themes with persistence
- **Responsive Design:** Works on all devices
- **Loading States:** Skeleton screens and spinners
- **Toast Notifications:** Real-time feedback for all actions
- **Confirmation Dialogs:** Prevent accidental deletions
- **Error Handling:** User-friendly error messages

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
│   │   ├── users/              # User management
│   │   └── featured/           # Featured products
│   │
│   ├── features/               # Feature modules (domain-driven)
│   │   ├── auth/               # Authentication
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── data.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── home/               # Dashboard
│   │   ├── products/           # Products
│   │   ├── categories/         # Categories
│   │   ├── orders/             # Orders
│   │   ├── users/              # Users
│   │   └── featured/           # Featured products
│   │
│   └── shared/                 # Shared resources
│       ├── components/         # Cross-feature components
│       │   ├── ThemeToggle.tsx
│       │   └── TokenInitializer.tsx
│       │
│       ├── context/            # Global state providers
│       │   └── ThemeContext.tsx
│       │
│       ├── hooks/              # Shared custom hooks
│       │   ├── useAdminForm.ts
│       │   ├── useApiMutation.ts
│       │   ├── useResourceFetch.ts
│       │   └── useDeleteConfirmation.ts
│       │
│       ├── lib/                # Core utilities
│       │   ├── api.ts          # Admin API client
│       │   ├── tauriKeystore.ts # Secure storage
│       │   ├── tokenValidator.ts # JWT validation
│       │   ├── urlResolver.ts   # URL resolution
│       │   ├── cloudinary.ts    # Image upload
│       │   └── utils.ts         # Helper functions
│       │
│       └── ui/                 # Reusable UI primitives
│           ├── Button.tsx
│           ├── Table.tsx
│           ├── Modal.tsx
│           ├── SearchBar.tsx
│           ├── CustomSelect.tsx
│           ├── StatusBadge.tsx
│           ├── ErrorAlert.tsx
│           ├── LoadingState.tsx
│           └── ConfirmDialog.tsx
│
├── src-tauri/                  # Tauri desktop app (optional)
│   ├── src/
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── capabilities/
│   │   └── default.json
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

### Architecture Principles

- **Feature-based organization by business domain**
- **Colocation:** Related components, hooks, and utilities live together
- **Separation of concerns** between features and shared code
- **Scalability:** Easy to add new features without affecting existing code
- **Reusability:** Shared UI components and utilities in dedicated folders

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js:** v20 or higher
- **npm:** v10 or higher
- **Backend:** The `ecommerce-backend` must be running
- **Admin Account:** You need admin credentials to access the dashboard
- **Optional:** Rust and Tauri CLI (for desktop app)

### Installation

1. **Clone and install:**

   ```bash
   git clone https://github.com/JustinCCodes/WBS_Group_Project_5_Admin_Dashboard.git
   cd ecommerce-admin
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.local.example .env.local
   ```

3. **Edit `.env.local`:**

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:8001/api/v1/auth

   # SSR Fallbacks
   API_BASE_URL=http://localhost:8000/api/v1
   AUTH_SERVER_URL=http://localhost:8001/api/v1/auth

   # Cloudinary Configuration (for image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Open:** [http://localhost:3002](http://localhost:3002)

6. **Login with admin credentials**

---

## 📜 Available Scripts

| Command       | Description                           |
| ------------- | ------------------------------------- |
| npm run dev   | Start development server on port 3002 |
| npm run build | Build production-ready application    |
| npm start     | Start production server on port 3002  |
| npm run lint  | Run ESLint for code quality           |
| npm run tauri | Run Tauri desktop app (optional)      |

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

- Dashboard: /dashboard
- Products: /products
- Categories: /categories
- Orders: /orders
- Users: /users
- Featured: /featured

---

## 🔐 Authentication Flow

### Desktop Grant Flow (Primary)

1. **Admin Login:** Credentials + `grant_type: "desktop"` sent to `/auth/login`
2. **Token Response:** Backend returns `accessToken` and user object
3. **Role Verification:** Client validates user has admin role
4. **Secure Storage:** Token stored in Tauri keystore (encrypted)
5. **Token Injection:** Bearer token sent in Authorization header for all requests
6. **Auto Refresh:** Token refreshed automatically before expiration

### Web Fallback (Cookie-based)

1. **Admin Login:** Standard credentials to `/auth/login`
2. **Cookie Storage:** Backend sets httpOnly cookies
3. **Automatic Inclusion:** Cookies sent with every request
4. **CSRF Protection:** Double-submit token pattern
5. **Route Protection:** All dashboard pages require valid session

#### Key Differences

- **Desktop Mode:** Explicit JWT access tokens in Authorization header
- **Web Mode:** Implicit httpOnly cookies with credentials
- **Storage:** Tauri keystore vs browser cookies
- **Security:** Both modes use CSRF protection and role validation

---

## 🎨 Feature Highlights

### Product Draft System

- Auto-save up to 10 product drafts
- Resume editing any draft
- Create multiple products simultaneously
- Automatic timestamps and naming
- Delete individual drafts

### Stock Editor

- Inline stock editing with visual feedback
- Color-coded warnings (red: out, orange: low, yellow: medium, green: good)
- Real-time validation
- Confirmation before saving

### User Ban System

```typescript
// Ban user with reason and optional expiry
await banUser(userId, {
  reason: "Violation of terms",
  until: "2025-12-31T23:59:59Z", // Optional
});

// Unban user
await unbanUser(userId);
```

### Featured Products

```typescript
// Toggle featured status
await featureProduct(productId);
await unfeatureProduct(productId);
```

---

## 🧰 Custom Hooks

### Feature-Specific Hooks

- `useProducts`: Fetch and manage products with caching
- `useCategories`: Category management and fetching
- `useOrders`: Order data management
- `useUsers`: User data fetching and management
- `useFeaturedProducts`: Featured products handling

### Shared Hooks

- `useAdminForm`: Generic form state management with validation
- `useApiMutation`: API mutation operations (create, update, delete)
- `useResourceFetch`: Generic resource fetching with loading states
- `useDeleteConfirmation`: Confirmation dialogs for delete operations

---

## 🎨 Design System

### Tailwind CSS 4 Theme

- **Colors:** Amber/Yellow accents, Zinc grayscale
- **Typography:** Inter font family
- **Spacing:** 4px base grid
- **Dark Mode:** Class-based dark mode support
- **Components:** Reusable button, card, and table styles

### UI Component Library

#### Data Display

- `Table`: Generic table with sorting and pagination
- `StatusBadge`: Color-coded status indicators
- `LoadingState`: Consistent loading indicators
- `ErrorAlert`: Error message display

#### Forms & Input

- `Button`: Customizable button with loading states (7 variants)
- `SearchBar`: Search input with debouncing
- `CustomSelect`: Dropdown select with portal rendering
- `Modal`: Reusable modal dialog

#### Navigation & Feedback

- `BackButton`: Navigation helper
- `ConfirmDialog`: Confirmation dialogs
- `ThemeToggle`: Light/dark mode switcher

---

## 🚢 Deployment

### Vercel (Recommended)

1. Import repository to Vercel
2. Add environment variables from `.env.local`
3. Update URLs to production backend
4. Deploy:
   ```bash
   vercel --prod
   ```

### Manual Build

```bash
npm run build
npm start
```

### Deployment Checklist

- ✅ Set production API URLs
- ✅ Verify admin account exists in backend
- ✅ Configure HTTPS for production
- ✅ Set CORS to allow admin domain
- ✅ Add Cloudinary credentials

---

## 🐛 Troubleshooting

| Issue                     | Solution                                                                         |
| ------------------------- | -------------------------------------------------------------------------------- |
| Cannot connect to backend | Ensure backend running on port 8000/8001, check .env.local URLs                  |
| Authentication failed     | Verify admin credentials, check user has admin role, clear keystore/localStorage |
| Unauthorized access       | Ensure JWT token valid, check Bearer token in headers, verify CSRF token         |
| Build errors              | Run npm install, delete .next folder, check npm run lint                         |
| Cloudinary upload fails   | Verify all env vars, check account quota, confirm API key permissions            |
| Desktop app won't start   | Install Rust/Tauri CLI, check system requirements, verify Tauri config           |
| Draft products not saving | Check localStorage enabled, verify browser not in private mode                   |
| Stock editor not updating | Ensure admin permissions, check network tab for errors, verify product ID        |

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

## 🔗 Related Projects

- [Backend API: ecommerce-backend](../ecommerce-backend)
- [Customer Frontend: ecommerce-frontend](../ecommerce-frontend)

---

## 👨‍💻 Author

Justin Sturm

[GitHub](https://github.com/JustinCCodes)
[LinkedIn](https://www.linkedin.com/in/justinsturm/)

---

## 📄 License

Private project for educational purposes.
