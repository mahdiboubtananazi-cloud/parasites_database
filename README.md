# قاعدة البيانات الرقمية للطفيليات
# Digital Parasites Database

A comprehensive bilingual (Arabic/French/English) web application for managing and documenting parasites discovered in the Parasitology Department.

## Features

- **Bilingual Interface**: Full support for Arabic, French, and English
- **Parasite Database**: Browse and search parasites with detailed scientific information
- **Microscopic Images**: View high-quality microscopic images of parasites
- **Sample Management**: Track and manage collected samples
- **User Authentication**: Secure login and registration system
- **Data Entry**: Add new parasites and samples to the database
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technologies Used

### Frontend
- React 19.2.0
- TypeScript
- React Router DOM 7.9.5
- i18next 25.6.0 (Internationalization)
- Lucide React 0.552.0 (Icons)
- Vite 7.1.12 (Build tool)

### Backend (Ready for Integration)
- Drizzle ORM
- PostgreSQL

## Getting Started

### Installation

```bash
pnpm install
pnpm dev
```

The development server runs on `http://localhost:5173/`

## Project Structure

- **src/components/**: Reusable UI components
- **src/pages/**: Page components (Home, ParasitesList, etc.)
- **src/i18n/**: Internationalization configuration
- **public/images/**: Static images and parasite photos

## Features Overview

- **Home Page**: Overview, statistics, and recent additions
- **Parasites List**: Browse and filter parasites
- **Parasite Details**: Comprehensive information with images
- **Add Parasite**: Form to add new parasites (authenticated users)
- **Add Sample**: Create sample records (authenticated users)
- **Authentication**: User registration and login

## Language Support

- Arabic (العربية) - Default
- French (Français)
- English

## Responsive Design

Optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Future Enhancements

- PostgreSQL database integration
- Backend API development
- Advanced analytics
- Export functionality
- Multi-file uploads
- User roles and permissions

## Browser Support

Chrome, Firefox, Safari, and Edge (latest versions)
