# Syntax E-Commerce Admin Dashboard 🎛️

A powerful, secure admin dashboard for managing e-commerce operations. Built with Next.js 15, React 19, and TypeScript 5. Features comprehensive product management, order tracking, user administration, and real-time analytics.

**Version 2.0** - Now w---

## ✨ Feature Highlights

| Feature        | Components                                                                                      | Key Capabilities                                                        |
| -------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Products**   | ProductsManagement, ProductForm, ProductsTable, ProductFilters, ImageUploadSection, StockEditor | Full CRUD, image upload, stock tracking, filtering, sorting, pagination |
| **Categories** | CategoriesManagement, CategoryForm, CategoriesTable, CategoryFilters                            | Full CRUD, search, sort, product count tracking                         |
| **Orders**     | OrdersManagement, OrdersTable, OrderFilters, OrderDetailsModal                                  | Status updates, filtering, revenue tracking, detailed views             |
| **Users**      | UsersManagement, UsersTable, UserFilters, BanUserModal                                          | User management, ban/unban, filtering, sorting                          |
| **Featured**   | FeaturedProductsManagement, FeaturedProductsGrid, FeaturedProductCard, FeaturedPagination       | Toggle featured status, card layout, pagination                         |
| **Dashboard**  | AdminDashboard                                                                                  | Statistics, low stock alerts, recent orders, quick navigation           |
| **Auth**       | LoginForm, LoginPage                                                                            | Secure login, JWT tokens, role verification                             |

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
- **Advanced Filtering:** Search by name, filter by category, sort by multiple criteria
- **Stock Editor:** Dedicated component for inventory management
- **Image Upload:** Cloudinary integration with preview and validation
- **Category Assignment:** Dropdown selection with validation
- **Featured Status:** Toggle products for homepage display
- **Bulk Operations:** Unsaved products panel for batch management
- **Form Validation:** Real-time validation with error feedback
- **Responsive Tables:** Mobile-friendly product listings

### 📦 Order Management

- **Order Overview:** View all customer orders with status badges
- **Order Details Modal:** Detailed view of order items and customer info
- **Status Updates:** Change order status with confirmation
- **Advanced Filtering:** Search by ID, filter by status, date range, sort options
- **Revenue Tracking:** Real-time filtered revenue calculation
- **Order Table:** Sortable columns with customer information
- **Delete Orders:** Remove orders with confirmation dialogs

### 👥 User Management

- **User Directory:** View all registered customers with pagination
- **User Search:** Filter by name, email, or status
- **Account Control:** Ban/unban user accounts with modal confirmation
- **User Status Badges:** Visual indicators for banned/active users
- **Sorting Options:** Sort by name, email, or registration date
- **Role Display:** View user roles and permissions

### 🗂️ Category Management

- **Category CRUD:** Create, read, update, and delete categories
- **Category Table:** Sortable table with search functionality
- **Category Form:** Inline forms for quick edits
- **Category Filters:** Search and sort by name or date
- **Product Count:** Track products per category
- **Validation:** Required fields with error handling

### 🎨 Featured Products Management

- **Featured Grid:** Card-based layout for featured products
- **Toggle Featured:** Mark/unmark products as featured
- **Pagination:** Navigate through featured products
- **Product Cards:** Visual representation with images
- **Quick Actions:** Direct access to product management
- **Empty State:** Clear messaging when no featured products

### 🌓 Theme & Preferences

- **Light/Dark Mode:** Toggle between themes
- **Persistent Preferences:** Theme saved to localStorage
- **System Integration:** Respects system theme preferences
- **Smooth Transitions:** Animated theme changes

### 🔐 Security & Authentication

- **Desktop Grant Authentication:** OAuth2-style desktop grant flow with JWT access tokens
- **Dual Auth Modes:** Bearer tokens (desktop) + httpOnly cookies (web fallback)
- **CSRF Protection:** Double-submit cookie pattern for state-changing requests
- **Role-Based Access:** Admin-only routes with role verification
- **Automatic Token Refresh:** Seamless session management
- **Secure Storage:** Tauri keystore for desktop, httpOnly cookies for web
- **Token Validation:** Client-side JWT validation with expiry checks

---

## 📁 Project Structure

The project follows a **feature-based modular architecture** for better organization and scalability:

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
│   │   ├── auth/               # Authentication feature
│   │   │   ├── components/     # LoginForm, LoginPage
│   │   │   ├── hooks/          # useAuth hooks
│   │   │   ├── data.ts         # Auth API calls
│   │   │   ├── types.ts        # Auth types
│   │   │   └── index.ts        # Feature exports
│   │   │
│   │   ├── home/               # Dashboard feature
│   │   │   ├── components/     # AdminDashboard
│   │   │   ├── data.ts         # Dashboard API calls
│   │   │   ├── types.ts        # Dashboard types
│   │   │   └── index.ts        # Feature exports
│   │   │
│   │   ├── products/           # Products feature
│   │   │   ├── components/     # ProductsManagement, ProductForm,
│   │   │   │                   # ProductsTable, ProductFilters,
│   │   │   │                   # ImageUploadSection, StockEditor, etc.
│   │   │   ├── hooks/          # useProducts, useProductForm
│   │   │   ├── utils/          # Product utilities
│   │   │   ├── data.ts         # Products API calls
│   │   │   ├── types.ts        # Product types
│   │   │   └── index.ts        # Feature exports
│   │   │
│   │   ├── categories/         # Categories feature
│   │   │   ├── components/     # CategoriesManagement, CategoryForm,
│   │   │   │                   # CategoriesTable, CategoryFilters
│   │   │   ├── hooks/          # useCategories, useCategoryForm
│   │   │   ├── data.ts         # Categories API calls
│   │   │   ├── types.ts        # Category types
│   │   │   └── index.ts        # Feature exports
│   │   │
│   │   ├── orders/             # Orders feature
│   │   │   ├── components/     # OrdersManagement, OrdersTable,
│   │   │   │                   # OrderFilters, OrderDetailsModal
│   │   │   ├── hooks/          # useOrders, useOrderForm
│   │   │   ├── data.ts         # Orders API calls
│   │   │   ├── types.ts        # Order types
│   │   │   └── index.ts        # Feature exports
│   │   │
│   │   ├── users/              # Users feature
│   │   │   ├── components/     # UsersManagement, UsersTable,
│   │   │   │                   # UserFilters, BanUserModal
│   │   │   ├── hooks/          # useUsers, useUserForm
│   │   │   ├── data.ts         # Users API calls
│   │   │   ├── types.ts        # User types
│   │   │   └── index.ts        # Feature exports
│   │   │
│   │   ├── featured/           # Featured products feature
│   │   │   ├── components/     # FeaturedProductsManagement,
│   │   │   │                   # FeaturedProductsGrid, FeaturedHeader,
│   │   │   │                   # FeaturedProductCard, FeaturedPagination
│   │   │   ├── hooks/          # useFeaturedProducts
│   │   │   ├── types.ts        # Featured types
│   │   │   └── index.ts        # Feature exports
│   │   │
│   │   ├── data.ts             # Shared API functions
│   │   ├── types.ts            # Shared feature types
│   │   └── index.ts            # Root feature exports
│   │
│   ├── shared/                 # Shared resources
│   │   ├── components/         # Cross-feature components
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── TokenInitializer.tsx
│   │   │
│   │   ├── context/            # Global state providers
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── hooks/              # Shared custom hooks
│   │   │   ├── useAdminForm.ts
│   │   │   ├── useApiMutation.ts
│   │   │   ├── useResourceFetch.ts
│   │   │   ├── useDeleteConfirmation.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── lib/                # Core utilities
│   │   │   ├── api.ts          # Admin API client
│   │   │   ├── tauriKeystore.ts # Secure storage (Tauri)
│   │   │   ├── tokenValidator.ts # JWT validation
│   │   │   ├── urlResolver.ts   # URL resolution
│   │   │   ├── cloudinary.ts    # Image upload
│   │   │   └── utils.ts         # Helper functions
│   │   │
│   │   ├── types/              # Shared type definitions
│   │   │   └── types.ts
│   │   │
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── Button.tsx
│   │       ├── Table.tsx
│   │       ├── Modal.tsx
│   │       ├── SearchBar.tsx
│   │       ├── CustomSelect.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── ErrorAlert.tsx
│   │       ├── LoadingState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── BackButton.tsx
│   │
│   └── types/                  # Global type definitions
│       ├── tauri.d.ts          # Tauri type declarations
│       └── types.ts            # Global types
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

### 🏗️ Architecture Principles

- **Feature-Based Organization:** Each domain (auth, products, orders, etc.) is self-contained
- **Colocation:** Related components, hooks, and utilities live together
- **Separation of Concerns:** Clear boundaries between features and shared code
- **Scalability:** Easy to add new features without affecting existing code
- **Reusability:** Shared UI components and utilities in dedicated folders

### 🎣 Custom Hooks

The application uses a comprehensive set of custom hooks for business logic:

#### Feature-Specific Hooks

- **`useProducts`:** Fetch and manage products with caching
- **`useCategories`:** Category management and fetching
- **`useOrders`:** Order data management
- **`useUsers`:** User data fetching and management
- **`useFeaturedProducts`:** Featured products handling

#### Shared Hooks

- **`useAdminForm`:** Generic form state management with validation
- **`useApiMutation`:** API mutation operations (create, update, delete)
- **`useResourceFetch`:** Generic resource fetching with loading states
- **`useDeleteConfirmation`:** Confirmation dialogs for delete operations

### 🧰 Shared Utilities

- **`api.ts`:** Centralized Axios client with interceptors
- **`utils.ts`:** Helper functions (sorting, filtering, formatting)
- **`tauriKeystore.ts`:** Secure token storage for desktop
- **`tokenValidator.ts`:** JWT validation and parsing
- **`urlResolver.ts`:** Environment-based URL resolution
- **`cloudinary.ts`:** Image upload integration

### 🎨 UI Component Library

The application includes a comprehensive set of reusable UI components:

#### Data Display

- **`Table`:** Generic table component with sorting and pagination
- **`StatusBadge`:** Color-coded status indicators
- **`LoadingState`:** Consistent loading indicators
- **`ErrorAlert`:** Error message display

#### Forms & Input

- **`Button`:** Customizable button with loading states
- **`SearchBar`:** Search input with debouncing
- **`CustomSelect`:** Dropdown select component
- **`Modal`:** Reusable modal dialog

#### Navigation & Feedback

- **`BackButton`:** Navigation helper
- **`ConfirmDialog`:** Confirmation dialogs
- **`ThemeToggle`:** Light/dark mode switcher

## �🛠️ Getting Started

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

### Low Stock Alerts

- **Inventory Monitoring:** Real-time tracking of low stock products
- **Visual Warnings:** Alert badges for items needing restock
- **Quick Navigation:** Direct links to product management

### Recent Activity

- **Newest Orders:** Real-time order feed with status
- **Order Details:** Quick view of recent transactions
- **Customer Information:** User details for recent orders

### Quick Actions

- **Navigation Cards:** One-click access to all management sections
- **Icon-Based UI:** Visual categorization with Lucide icons
- **Hover Effects:** Interactive feedback on navigation elements

---

## 🛍️ Product Management

### Features

- **Create Products:** Add new items with details and images
- **Edit Products:** Update product information with inline editing
- **Delete Products:** Remove discontinued items with confirmation
- **Category Assignment:** Organize products with dropdown selection
- **Stock Management:** Track inventory with dedicated stock editor
- **Price Management:** Set product pricing with validation
- **Image Upload:** Cloudinary integration for image hosting
- **Image Preview:** Visual feedback for uploaded images
- **Bulk Operations:** Unsaved changes panel for batch updates
- **Advanced Filtering:** Search, sort, and filter by multiple criteria
- **Pagination:** Efficient browsing of large product catalogs
- **Validation:** Real-time form validation with error messages

### Product Fields

- Name (required)
- Description (required)
- Price (required, positive number)
- Stock quantity (required, integer)
- Category (required, dropdown)
- Featured status (toggle)
- Image (upload with preview)
- Created/Updated timestamps
- Created by (admin tracking)

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

## �️ Development Experience

### Hot Module Replacement

- Fast refresh for instant feedback during development
- Preserves component state during edits
- Error overlay for quick debugging

### Type Safety

- Full TypeScript coverage
- Compile-time error checking
- IntelliSense support in VS Code
- Type-safe API calls and responses

### Developer Tools

- React DevTools compatibility
- Browser DevTools integration
- Network request inspection
- Console logging for debugging

### Code Quality

- ESLint configuration for Next.js
- Consistent code formatting
- Import organization
- Unused code detection

---

## �🚢 Deployment

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

## 📝 Code Style & Best Practices

### TypeScript Standards

- **Strict Mode:** Enabled for type safety
- **Type Definitions:** Comprehensive interfaces and types
- **Type Exports:** Centralized type exports per feature
- **No Implicit Any:** All types explicitly defined

### Component Architecture

- **Functional Components:** React hooks-based architecture
- **Component Composition:** Small, focused, reusable components
- **Custom Hooks:** Business logic extracted into hooks
- **Separation of Concerns:** UI, logic, and data layers separated

### Code Organization

- **Feature-Based:** Domain-driven folder structure
- **Colocation:** Related files grouped together
- **Index Exports:** Clean public APIs for features
- **Barrel Files:** Simplified imports across features

### Naming Conventions

- **Components:** PascalCase (e.g., `ProductsManagement`)
- **Files:** Matching component name (e.g., `ProductsManagement.tsx`)
- **Functions/Variables:** camelCase (e.g., `handleSubmit`, `isLoading`)
- **Types/Interfaces:** PascalCase (e.g., `Product`, `ApiResponse`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Hooks:** Prefixed with "use" (e.g., `useProducts`, `useApiMutation`)

### Error Handling

- **Try-Catch Blocks:** Comprehensive error catching
- **User-Friendly Messages:** Toast notifications for errors
- **Loading States:** Visual feedback during operations
- **Form Validation:** Real-time validation with error messages
- **API Error Handling:** Centralized error handling in API client

### Comments & Documentation

- **Inline Comments:** Explaining complex logic
- **Type Comments:** Describing type purposes
- **README Files:** Feature-specific documentation where needed

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
