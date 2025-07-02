# DChat

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, real-time chat application built with Next.js, TypeScript, and Supabase. DChat provides a seamless messaging experience with features like real-time updates, user authentication, and responsive design.

## ✨ Features

- 🔒 Secure user authentication with Supabase Auth
- 💬 Real-time messaging with WebSockets
- 🎨 Clean, responsive UI built with Radix UI and Tailwind CSS
- 🌓 Dark/Light mode support
- 📱 Mobile-friendly design
- 🚀 Built with Next.js App Router
- 🔄 Real-time presence and typing indicators
- 📱 Optimized for both desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, React 19
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Backend**: Supabase (Auth, Database, Storage)
- **Database**: PostgreSQL
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: next-intl
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel (recommended)

## 📦 Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm
- Supabase account
- PostgreSQL database

## 🛠️ Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/chatd.git
   cd chatd
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_SUPABASE_USER_STORAGE_BUCKET_NAME=your_supabase_user_storage_bucket_name
   NEXT_PUBLIC_SUPABASE_USER_STORAGE_BUCKET_URL=your_supabase_user_storage_bucket_url
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
.
├── src/
│   ├── app/                # App router pages and layouts
│   ├── components/         # Reusable UI components
│   ├── lib/                # Core application logic and utilities
│   │   ├── actions/        # Server actions
│   │   ├── errors/         # Custom error classes and handlers
│   │   ├── i18n/           # Internationalization configurations
│   │   ├── repositories/   # Data access layer
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── services/       # Business logic services
│   │   ├── store/          # Client-side state management
│   │   ├── types/          # TypeScript type definitions
│   │   ├── api-wrapper.ts  # API client wrapper
│   │   ├── helpers.ts      # Utility functions
│   │   ├── prisma.ts       # Prisma client configuration
│   │   ├── server-action-wrapper.ts # Server action utilities
│   │   ├── supabase-client.ts # Supabase client configuration
│   │   ├── supabase-server.ts # Server-side Supabase client
│   │   └── utils.ts        # Additional utilities
│   ├── providers/          # Application context providers
│   │   ├── QueryProvider.tsx  # React Query provider
│   │   ├── ThemeProvider.tsx  # Theme management
│   │   └── ToastProvider.tsx  # Toast notifications
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles and Tailwind config
│   └── utils/              # Helper functions
├── prisma/                 # Database schema and migrations
├── public/                 # Static files
└── supabase/               # Supabase configurations and migrations
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/chatd](https://github.com/yourusername/chatd)
