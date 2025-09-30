# Smart Appointment Booking System

A comprehensive appointment booking system built with **Blitz.js**, **Prisma**, **PostgreSQL**, and **Material-UI (MUI)**.

## 🚀 Features

- **Role-based Authentication** (USER, PROFESSIONAL, ADMIN)
- **Professional Profiles** with ratings and availability
- **Appointment Booking** with conflict detection
- **Payment Processing** with multiple methods
- **Real-time Notifications** (Email, SMS, Push)
- **Responsive Design** with Material-UI

## 🛠️ Tech Stack

- **Framework**: Blitz.js (Next.js + Full-stack)
- **Database**: PostgreSQL with Prisma ORM
- **UI Library**: Material-UI (MUI) v5
- **Authentication**: Blitz Auth
- **Validation**: Zod schemas
- **Containerization**: Docker

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed sample data
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Setup

```bash
# Start PostgreSQL
npm run docker:up

# Run migrations and seed
npx prisma migrate dev
npm run seed
```

## 📊 Sample Data

The seed script creates:
- 1 Admin user (`admin@appbook.com` / `admin123`)
- 4 Regular users (`password123`)
- 5 Professionals with different services
- 10 Sample appointments
- 5 Payment records
- 20 Notifications

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database
npm run db:reset     # Reset and seed database
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
```

## 📱 Key Pages

- **Dashboard**: Role-based landing page
- **Professionals**: Browse and search professionals
- **Professional Profile**: Detailed view with booking
- **Appointments**: Manage bookings
- **Profile**: User settings

## 🔐 User Roles

- **USER**: Browse professionals, book appointments
- **PROFESSIONAL**: Manage schedule, view appointments
- **ADMIN**: System administration, user management

## 🏥 Service Types

Doctor, Dentist, Salon, Spa, Gym, Consultant, Therapist, Trainer

---

**Built with ❤️ using Blitz.js, Prisma, and Material-UI**
