# Al-Diyar | Real Estate Marketplace 🏠

Al-Diyar is a state-of-the-art, role-based real estate platform built with the modern web stack. It provides a seamless experience for buyers, sellers, and agents to interact in a secure and high-performance environment.

---

## ✨ Key Features

### 🔐 Advanced Authentication
- **Role-Based Access Control (RBAC)**: Distinct workflows for **Admin**, **Agent**, **Seller**, and **User**.
- **OTP Verification**: Secure email-based one-time password system for account security.
- **Provider Integration**: Secure login using NextAuth.js.

### 🏘️ Real Estate Marketplace
- **Dynamic Listings**: High-fidelity property showcases with detailed information and image galleries.
- **Advanced Filtering**: Categorized search for specific property types and locations.
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
- **Role-Specific UI**: Completely unique dashboard experiences for each user type.

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
- **Real-time**: [Socket.io](https://socket.io/)
- **Storage**: [Cloudinary](https://cloudinary.com/) (Image management)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)

---

## 📁 Project Structure

```text
al-diyar/
├── public/                 # Static assets (images, icons)
├── scripts/                # Database seeding & maintenance scripts
├── src/
│   ├── app/                # Next.js App Router (Pages & API)
│   │   ├── api/            # Server-side API Endpoints (Organized by role)
│   │   ├── dashboard/      # Role-specific dashboard layouts & pages
│   │   ├── properties/     # Property listing & detail pages
│   │   └── blog/           # Article & content pages
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Core UI building blocks (Shadcn/Radix)
│   │   ├── forms/          # Specialized form components
│   │   └── blocks/         # High-level section components
│   ├── hooks/              # Custom React hooks (useSocket, useAuth, etc.)
│   ├── lib/                # Core logic (MongoDB, Stripe, OTP, Email)
│   ├── models/             # Mongoose Data Models
│   └── types/              # TypeScript definitions
├── .env.local              # Local environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🔌 API Endpoints

### 👤 User Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Retrieve current user profile. |
| `PUT` | `/api/user/profile` | Update user profile information. |
| `GET` | `/api/user/bookings` | Fetch list of property bookings by user. |
| `POST` | `/api/user/bookings/pay` | Initiate Stripe payment for a booking. |
| `GET` | `/api/user/saved` | Get user's saved/favorited listings. |
| `GET` | `/api/user/stats` | Retrieve user-specific activity statistics. |

### 🏪 Seller & Agent Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/POST` | `/api/seller/listings` | List or create seller property listings. |
| `PUT/DELETE` | `/api/seller/listings/[id]` | Update or remove a specific listing. |
| `GET` | `/api/agent/assigned-listings` | Get properties assigned to agent for review. |
| `POST` | `/api/agent/assigned-listings/[id]/approve` | Agent approval for a listing. |

### 🛠️ Admin Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Platform-wide analytics data. |
| `GET/POST` | `/api/admin/blogs` | Manage platform blog posts. |
| `POST` | `/api/admin/approve-user` | Approve new user registrations. |

---

## 🚀 Future Roadmap

- [ ] **AI Property Matcher**: Intelligent recommendations based on user behavior.
- [ ] **360° Virtual Tours**: Integrate immersive property walkthroughs.
- [ ] **Mobile App**: Launch dedicated Android and iOS versions using React Native.
- [ ] **Multi-currency Support**: Global currency conversion for international users.
- [ ] **Smart Contracts**: Blockchain-based property agreement signing.
- [ ] **Mortgage Calculator**: Built-in financial tools for buyer planning.

---

## 💻 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/al-diyar.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file and fill in required keys (MongoDB, Stripe, Cloudinary, NextAuth).
4. **Run development server**:
   ```bash
   npm run dev
   ```

---

*Built with by the Merged Conflict Team.*
