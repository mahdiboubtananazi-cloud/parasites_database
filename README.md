# قاعدة البيانات الرقمية للطفيليات
# Digital Parasites Database

A comprehensive bilingual (Arabic/French/English) web application for managing and documenting parasites discovered in the Parasitology Department at جامعة العربي بن مهيدي.

## ✨ Features

- **🌐 Bilingual Interface**: Full support for Arabic, French, and English
- **🔬 Parasite Database**: Browse and search parasites with detailed scientific information
- **📸 Microscopic Images**: View high-quality microscopic images of parasites
- **📋 Sample Management**: Track and manage collected samples
- **🔐 User Authentication**: Secure login and registration system with JWT tokens
- **📝 Data Entry**: Add new parasites and samples to the database
- **🔍 Advanced Search & Filter**: Search by name, filter by host species and discovery year
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Beautiful Material-UI design with university branding
- **⚡ Performance**: Code splitting, lazy loading, and optimized rendering

## 🛠️ Technologies Used

### Frontend
- **React 19.1.1** - UI library
- **TypeScript** - Type safety
- **Vite 7.1.7** - Build tool and dev server
- **Material-UI (MUI) 7.3.5** - Component library
- **React Router DOM 7.9.5** - Routing
- **i18next 25.6.0** - Internationalization
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Architecture
- **Context API** - State management (Auth, Toast)
- **Custom Hooks** - Reusable logic (useAuth, useParasites)
- **API Services** - Centralized API calls
- **Error Boundaries** - Error handling
- **Protected Routes** - Route guards

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

The development server runs on `http://localhost:5173/`

### Build for Production

```bash
pnpm build
pnpm preview
```

## 📁 Project Structure

```
src/
├── api/                    # API services
│   ├── client.ts          # Axios configuration
│   ├── auth.ts            # Authentication API
│   ├── parasites.ts       # Parasites API
│   └── samples.ts         # Samples API
├── components/            # Reusable components
│   ├── auth/             # Auth components
│   │   ├── ProtectedRoute.tsx
│   │   └── GuestRoute.tsx
│   ├── core/             # Core components
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSpinner.tsx
│   └── layout/           # Layout components
│       ├── Sidebar.tsx
│       └── MainLayout.tsx
├── contexts/             # React Contexts
│   ├── AuthContext.tsx   # Authentication context
│   └── ToastContext.tsx  # Toast notifications
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   └── useParasites.ts
├── pages/                # Page components
│   ├── Home.tsx
│   ├── ParasitesList.tsx
│   ├── ParasiteDetail.tsx
│   ├── AddParasite.tsx
│   ├── AddSample.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── theme/                # Theme configuration
│   ├── colors.ts         # University color scheme
│   └── theme.ts          # MUI theme
├── i18n/                 # Internationalization
│   ├── config.ts
│   └── locales/
│       ├── ar.json
│       ├── fr.json
│       └── en.json
└── App.tsx               # Main app component
```

## 🎨 Features Overview

### Pages
- **Home Page**: Overview, statistics, and recent additions
- **Parasites List**: Browse and filter parasites with search
- **Parasite Details**: Comprehensive information with images
- **Add Parasite**: Form to add new parasites (authenticated users)
- **Add Sample**: Create sample records (authenticated users)
- **Authentication**: User registration and login

### Authentication
- JWT token-based authentication
- Protected routes for authenticated users
- Guest routes for login/register pages
- Automatic token refresh
- Secure logout

### UI/UX Features
- Responsive sidebar navigation
- Toast notifications for user feedback
- Loading states for async operations
- Error boundaries for error handling
- Form validation with helpful error messages
- University-branded color scheme

## 🌍 Language Support

- **Arabic (العربية)** - Default
- **French (Français)**
- **English**

Language can be changed from the sidebar menu.

## 📱 Responsive Design

Optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (< 768px)

## 🔐 Authentication

The app uses JWT tokens for authentication. In development mode, mock authentication is used. For production, configure your API URL in `.env`:

```env
VITE_API_URL=https://your-api-url.com/api
```

## 🎨 University Branding

The app uses the official university colors:
- **Primary Blue**: #1e3a8a (University blue)
- **Secondary Red**: #dc2626 (Scientific red)
- **Accent Colors**: Gold, Green, Purple

## 🚧 Development Mode

In development mode (when `VITE_API_URL` is not set), the app uses mock data:
- Mock parasites data
- Mock authentication
- Local storage for persistence

## 🔄 API Integration

To connect to a real backend:

1. Set `VITE_API_URL` in `.env`
2. Ensure your API follows these endpoints:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/auth/me`
   - `GET /api/parasites`
   - `GET /api/parasites/:id`
   - `POST /api/parasites`
   - `GET /api/samples`
   - `POST /api/samples`

## 📝 Future Enhancements

- [ ] PostgreSQL database integration
- [ ] Backend API development
- [ ] Advanced analytics dashboard
- [ ] Export functionality (PDF, Excel)
- [ ] Multi-file image uploads
- [ ] User roles and permissions
- [ ] Dark mode support
- [ ] Advanced search with filters
- [ ] Data visualization charts
- [ ] Email notifications

## 🐛 Known Issues

- Mock data is reset on page refresh (will be fixed with backend integration)
- Image uploads are currently stored as base64 (will use file storage in production)

## 📄 License

This project is for educational and research purposes at جامعة العربي بن مهيدي.

## 👥 Contributors

Parasitology Department - جامعة العربي بن مهيدي

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for the Parasitology Department**
