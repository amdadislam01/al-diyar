# 🏠 Al-Diyar | Real Estate Marketplace 

Al-Diyar is a state-of-the-art, role-based real estate platform built with the modern web stack. It provides a seamless experience for buyers, sellers, and agents to interact in a secure and high-performance environment.
---

## ✨ Key Features

### 🔐 Advanced Authentication
- **Role-Based Access Control (RBAC)**: Distinct workflows for **Admin**, **Agent**, **Seller**, and **User**.
- **OTP Verification**: Secure email-based one-time password system for account security.
- **Provider Integration**: Secure login using NextAuth.js.

### 🏘️ Real Estate Marketplace
- **Dynamic Listings**: High-fidelity property showcases with detailed information and image galleries.
- **Advanced Filtering**: Categorized search for specific property types and locations (Divisions, Districts, Upazilas).
- **Saved Listings**: Users can create a personal wishlist of properties.

### 💳 Secure Payments (Stripe)
- **Stripe Checkout**: Integrated card payments for property bookings.
- **Automated Webhooks**: Real-time order status updates via Stripe events.
- **Transaction Verification**: Robust backend verification of payment success.

### 💬 Real-time Communication
- **Integrated Chat**: Direct messaging between users, sellers, and agents using **Socket.io**.
- **Real-time Notifications**: Instant updates for bookings, message arrivals, and status changes.

### 📊 Dynamic Dashboards & Analytics
- **Admin Analytics**: Visualize platform growth, revenue, and user engagement.
- **User Stats**: Track personal activity, bookings, and savings.
- **Role-Specific UI**: Dedicated dashboards for Admin, Agent, Seller, and Buyer.

### 📝 Content & Management
- **CMS (Blog System)**: Integrated blog management for SEO-optimized articles.
- **Listing Approval**: Automated workflow for Agents to review and approve seller-submitted properties.
- **User Management**: Admin tools for approving and managing platform participants.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [GSAP](https://gsap.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Stripe API](https://stripe.com/docs/api)
- **Real-time**: [Socket.io](https://socket.io/), [Socket.io-client](https://socket.io/)
- **Storage**: [Cloudinary](https://cloudinary.com/) (Next-Cloudinary)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **Maps**: [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/)

---

## 📁 Full Project Structure

```text
al-diyar/
├── public/                 # Static public assets
│   ├── images/             # UI images and assets
│   └── icons/              # Project icons
├── scripts/                # Database and maintenance scripts
│   ├── seed-country-agents.js
│   └── update-country-agent-passwords.js
├── src/
│   ├── app/                # Next.js Application Router
│   │   ├── (auth)/         # Authentication related pages
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── api/            # Backend API Endpoints
│   │   │   ├── admin/      # Admin-only endpoints (stats, approve-user, blogs, etc.)
│   │   │   ├── agent/      # Agent-specific workflows
│   │   │   ├── seller/     # Seller listing management
│   │   │   ├── user/       # User profile, bookings, saved items
│   │   │   ├── auth/       # NextAuth route handler
│   │   │   └── webhooks/   # External webhooks (Stripe)
│   │   ├── dashboard/      # Role-based dashboard interfaces
│   │   │   ├── admin/      # Admin management & analytics
│   │   │   ├── agent/      # Agent task views
│   │   │   ├── seller/     # Seller property management
│   │   │   └── user/       # User personal activity
│   │   ├── properties/     # Marketplace listing & property details
│   │   ├── blog/           # Platform blog and articles
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # React Component library
│   │   ├── layout/         # Navigation, Footer, Sidebar
│   │   ├── ui/             # Atomic UI components (Buttons, Inputs, etc.)
│   │   ├── forms/          # Form logic and validation schemas
│   │   ├── blocks/         # High-level section components
│   │   ├── property/       # Property-specific components
│   │   └── dashboard/      # Dashboard widgets and charts
│   ├── hooks/              # Custom React hooks (useSocket, useAuth)
│   ├── lib/                # Modular library logic
│   │   ├── auth.ts         # Authentication configuration
│   │   ├── mongodb.ts      # Database connection handler
│   │   ├── stripe.ts       # Payment gateway integration
│   │   ├── email.ts        # Nodemailer configuration
│   │   ├── otp.ts          # Verification logic
│   │   └── utils.ts        # General helper functions
│   ├── models/             # Mongoose Schemas (User, Listing, Booking, etc.)
│   ├── types/              # Global TypeScript definitions
│   └── styles/             # Global CSS and Tailwind directives
├── .env.local              # Local environment secrets (not in git)
├── components.json         # Shadcn configuration
├── next.config.ts          # Next.js settings
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS settings
├── server.js               # Custom server for Socket.io
├── tsconfig.json           # TypeScript rules
└── readme.md               # Project documentation
```

---

## 🔌 API Endpoints Documentation

### 👤 User Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Retrieve current user profile data. |
| `PUT` | `/api/user/profile` | Update personal account information. |
| `GET` | `/api/user/bookings` | View all property bookings by the user. |
| `POST` | `/api/user/bookings/pay` | Initiate Stripe Checkout for a booking. |
| `GET` | `/api/user/saved` | Fetch the user's wishlist of properties. |
| `POST` | `/api/user/saved` | Add or remove a property from saved list. |
| `GET` | `/api/user/stats` | Personal dashboard statistics. |

### 🏪 Seller & Agent Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/POST` | `/api/seller/listings` | Retrieve or create seller properties. |
| `PUT/DELETE` | `/api/seller/listings/[id]` | Modify/Remove a specific property. |
| `GET` | `/api/seller/bookings` | View incoming bookings for seller properties. |
| `GET` | `/api/agent/assigned-listings` | Get properties for agent verification. |
| `POST` | `/api/agent/assigned-listings/[id]/approve` | Verify and approve a property. |

### 🛠️ Admin Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Global platform analytics & metrics. |
| `GET` | `/api/admin/listings` | View all platform properties. |
| `GET/POST` | `/api/admin/blogs` | Manage platform blog content. |
| `POST` | `/api/admin/approve-user` | Authorize new user accounts. |

---

## 🚀 Future Roadmap

- [ ] **AI Property Insights**: Predictive analytics for property value trends.
- [ ] **Virtual Reality Tours**: Direct browser-based 3D property walkthroughs.
- [ ] **Multi-language Support**: Full internationalization (i18n) for global reach.
- [ ] **Mobile App**: Cross-platform mobile experience via React Native/Expo.
- [ ] **Mortgage Tools**: Integrated financial calculators for buyers.
- [ ] **Smart Contracts**: Legal agreement signing integrated into the platform.

---

## 💻 Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amdadislam01/al-diyar.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Setup environment**:
   Create a `.env.local` file based on the examples provided in the project.
4. **Initialize development**:
   ```bash
   npm run dev
   ```

---

*Built with ❤️ by the Merged Conflict Team.*
