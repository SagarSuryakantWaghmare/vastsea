# 🌊 VastSea

> A modern platform for sharing programming problems and solutions in multiple languages

VastSea is a comprehensive coding community platform built with Next.js 15, designed to help developers share, discover, and solve programming problems across multiple programming languages. Whether you're a beginner looking to learn or an expert wanting to contribute, VastSea provides an intuitive and beautiful interface for collaborative programming.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.16.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3.3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 📸 Screenshots

### Landing Page
The beautiful homepage featuring a modern gradient design, featured problems, and multi-language support showcase.

![Landing Page](./ScreenShots/landingpage.png)

### Light Theme
Clean and modern light theme interface showing the platform's responsive design and intuitive navigation.

![Light Theme](./ScreenShots/LightTheme.png)

### User Registration
Streamlined signup process with form validation, password visibility toggle, and user-friendly error handling.

![Sign Up](./ScreenShots/signup.png)

### Problems Gallery
Browse through coding problems with advanced filtering, search functionality, and organized card layout.

![Problems](./ScreenShots/Problems.png)

### Problem Details
Detailed problem view with syntax-highlighted code solutions in multiple programming languages.

![View Problem](./ScreenShots/ViewProblem.png)

### Add New Problem
Intuitive interface for contributors to add new coding problems with rich text editor and multi-language code input.

![Add Problem](./ScreenShots/AddProblem.png)

### Admin Dashboard
Comprehensive admin panel for user management, problem moderation, and platform analytics.

![Admin Panel](./ScreenShots/AdminPanel.png)

## ✨ Features

### 🔐 **Authentication & User Management**
- **Secure Authentication**: Built with NextAuth.js for robust user authentication
- **User Registration**: Easy signup process with email verification
- **Password Security**: Bcrypt encryption with secure password policies
- **User Profiles**: Customizable user profiles with activity tracking
- **Admin Panel**: Comprehensive admin dashboard for user and content management

### 🧩 **Problem Management**
- **Multi-Language Support**: Code solutions in Java, C, C++, and JavaScript
- **Rich Text Editor**: Create detailed problem descriptions with formatting
- **Code Syntax Highlighting**: Beautiful code display using Highlight.js
- **Tag System**: Organize problems with customizable tags
- **Search & Filter**: Advanced filtering by language, difficulty, and tags
- **CRUD Operations**: Full create, read, update, delete functionality

### 🏆 **Community Features**
- **Leaderboard**: Track top contributors based on problem submissions
- **User Dashboard**: Personal dashboard showing user's contributions and statistics
- **Problem Statistics**: View contribution counts and user rankings
- **Real-time Updates**: Live updates using modern React patterns

### 🎨 **User Experience**
- **Responsive Design**: Fully mobile-optimized interface
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Modern UI Components**: Built with Radix UI and shadcn/ui
- **Toast Notifications**: Real-time feedback using Sonner
- **Loading States**: Elegant loading indicators and skeleton screens

### 🔧 **Technical Features**
- **Server-Side Rendering**: Optimized performance with Next.js App Router
- **Database Integration**: MongoDB with Mongoose ODM
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schema validation with React Hook Form
- **Error Handling**: Comprehensive error handling and user feedback
- **SEO Optimized**: Meta tags and structured data

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.2.2
- **Styling**: TailwindCSS 3.3.3
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion 11.0.8
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React + React Icons

### **Backend**
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB 6.16.0
- **ODM**: Mongoose 8.2.2
- **Authentication**: NextAuth.js 4.24.7
- **Password Hashing**: bcryptjs 2.4.3
- **Validation**: Zod 3.23.8

### **Development**
- **Package Manager**: npm
- **Development Server**: Next.js Dev Server
- **Environment**: Node.js 20+
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database (Atlas or local)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SagarSuryakantWaghmare/vastsea.git
   cd vastsea
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vastsea?retryWrites=true&w=majority

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Admin Configuration
   ADMIN_EMAILS=your-email@example.com,admin@vastsea.com
   NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com,admin@vastsea.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
vastsea/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── signin/               # Sign in page
│   │   └── signup/               # Sign up page
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication APIs
│   │   ├── admin/                # Admin APIs
│   │   ├── problems/             # Problem APIs
│   │   └── leaderboard/          # Leaderboard API
│   ├── dashboard/                # User dashboard
│   ├── leaderboard/              # Community leaderboard
│   ├── problems/                 # Problem pages
│   │   └── [id]/                 # Dynamic problem pages
│   ├── about/                    # About page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── CodeBlock.tsx             # Code syntax highlighting
│   ├── CodeEditor.tsx            # Code editor component
│   ├── Footer.tsx                # Site footer
│   ├── Navbar.tsx                # Navigation bar
│   ├── ProblemCard.tsx           # Problem display card
│   └── ...                       # Other components
├── lib/                          # Utilities and configurations
│   ├── db/                       # Database configuration
│   │   ├── models/               # Mongoose models
│   │   └── mongodb.ts            # MongoDB connection
│   ├── auth-options.ts           # NextAuth configuration
│   ├── admin-utils.ts            # Admin utilities
│   └── utils.ts                  # General utilities
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
└── middleware.ts                 # Next.js middleware
```

## 🗄️ Database Schema

### **User Model**
```typescript
{
  name: String,           // User's display name
  email: String,          // Unique email address
  password: String,       // Hashed password
  role: String,           // 'user' | 'admin' | 'moderator'
  createdAt: Date,        // Account creation date
  updatedAt: Date         // Last profile update
}
```

### **Problem Model**
```typescript
{
  title: String,          // Problem title
  description: String,    // Problem description
  codes: {               // Code solutions
    java: String,        // Java solution
    c: String,           // C solution
    cpp: String,         // C++ solution
    js: String           // JavaScript solution
  },
  tags: [String],        // Problem tags
  author: ObjectId,      // Reference to User
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

## 🎯 Key Features Explained

### **Authentication Flow**
- Users can register with email and password
- Secure password hashing using bcryptjs
- JWT-based session management via NextAuth.js
- Role-based access control (Admin/User)
- Automatic redirection based on user role

### **Problem Management**
- Rich text editor for problem descriptions
- Multi-language code editor with syntax highlighting
- Tag-based categorization system
- Advanced search and filtering capabilities
- Admin approval workflow for new problems

### **Admin Dashboard**
- User management (view, edit, delete users)
- Problem moderation (approve, edit, delete problems)
- System statistics and analytics
- Bulk operations for content management

### **Leaderboard System**
- Real-time ranking based on problem contributions
- Medal system for top 3 contributors
- User statistics and achievement tracking
- Responsive design for mobile and desktop

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect your repository to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Add all variables from `.env.local`
   - Ensure MongoDB URI points to production database

3. **Deploy**
   ```bash
   vercel --prod
   ```

### **Alternative Deployment Options**
- **Netlify**: Compatible with Next.js
- **Railway**: Easy database and app deployment
- **DigitalOcean App Platform**: Full-stack deployment
- **AWS**: Using AWS Amplify or EC2

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run build:clean  # Clean build (Unix)
npm run build:clean:win # Clean build (Windows)
```

### **Development Workflow**
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Run linting: `npm run lint`
4. Commit changes: `git commit -m "Add feature"`
5. Push and create pull request

### **Code Style**
- **ESLint**: Configured for Next.js and TypeScript
- **Prettier**: Code formatting (recommended)
- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for variables, PascalCase for components

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit code improvements
- 🎨 Enhance UI/UX design

### **Contribution Guidelines**
1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add tests for new features
5. Update documentation as needed
6. Submit a pull request

### **Code of Conduct**
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sagar Suryakant Waghmare**
- GitHub: [@SagarSuryakantWaghmare](https://github.com/SagarSuryakantWaghmare)
- LinkedIn: [Sagar Waghmare](https://linkedin.com/in/sagarwaghmare44)
- Email: sagarwaghmare1384@gmail.com

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment platform
- **Radix UI** - For accessible UI primitives
- **shadcn/ui** - For beautiful component library
- **MongoDB** - For flexible document database
- **Community Contributors** - For feedback and contributions

## 🔗 Links

- **Live Demo**: [VastSea Platform](https://vastsea.vercel.app)
- **Documentation**: [Project Wiki](https://github.com/SagarSuryakantWaghmare/vastsea/wiki)
- **Issue Tracker**: [GitHub Issues](https://github.com/SagarSuryakantWaghmare/vastsea/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SagarSuryakantWaghmare/vastsea/discussions)

---

<div align="center">

**Made with ❤️ by [Sagar Waghmare](https://github.com/SagarSuryakantWaghmare)**

If you found this project helpful, please consider giving it a ⭐️!

</div>
