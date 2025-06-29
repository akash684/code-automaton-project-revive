
# VehicleHub - Vehicle Marketplace

A modern, responsive vehicle marketplace built with React, TypeScript, and Tailwind CSS. Buy and sell cars, bikes, and auto accessories across India.

## 🚀 Features

- **Vehicle Listings**: Browse cars and bikes with advanced filtering
- **Accessories Store**: Shop for auto accessories with ratings and reviews
- **Responsive Design**: Mobile-first design that works on all devices
- **Contact Forms**: Validated contact forms with Indian phone number support
- **Authentication**: Sign in with magic links or email/password
- **Modern UI**: Beautiful gradient designs and smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Backend**: Supabase integration ready

## 📱 Pages

- **Home**: Hero section with featured vehicles and stats
- **Vehicles**: Browse cars and bikes with filters
- **Accessories**: Shop auto accessories by category
- **About**: Company story, team, and values
- **Contact**: Contact form with multiple office locations
- **Sign In**: Authentication with magic links and email/password
- **404**: Custom not found page

## 🎨 Design Features

- Mobile-first responsive design
- Gradient backgrounds and modern card layouts
- Smooth hover animations and transitions
- Indian currency formatting (₹)
- Professional typography with proper hierarchy
- Accessibility-focused components

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📊 Components

### Core Components
- `Navbar` - Responsive navigation with mobile menu
- `Footer` - Company links and contact information
- `VehicleCard` - Vehicle listing card with details
- `FiltersPanel` - Advanced filtering for vehicles
- `ContactForm` - Validated contact form

### UI Components
- Built on shadcn/ui component library
- Custom styled buttons, inputs, cards
- Responsive grid layouts
- Loading states and animations

## 🔧 Configuration

### Environment Variables (Supabase)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tailwind Configuration
- Custom color palette with gradients
- Extended animations and transitions
- Responsive breakpoints
- Component-specific utilities

## 🗃️ Database Schema (Supabase)

The application is ready for Supabase integration with the following tables:

- **vehicles**: Cars and bikes listings
- **accessories**: Auto accessories with ratings
- **contact_submissions**: Contact form submissions
- **users**: User authentication (handled by Supabase Auth)

## 📈 Performance

- Optimized images with proper loading
- Lazy loading for components
- Efficient state management
- Mobile-optimized performance
- SEO-friendly meta tags

## 🔒 Security

- Input validation with Zod schemas
- XSS protection in forms
- Secure authentication flow
- Environment variable protection

## 🌐 SEO & Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Alt tags for images
- ARIA labels where needed
- Meta tags for social sharing

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Vite apps)
- Netlify
- Railway
- Any static hosting service

## 📝 License

This project is built with Lovable AI and is ready for commercial use.

---

**Generated by Lovable AI** - Your AI-powered development assistant
