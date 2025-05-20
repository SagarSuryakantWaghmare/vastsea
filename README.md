# 🌊 VastSea

**VastSea** is a modern, full-stack code-sharing and educational platform where users can explore practical programming problems along with code solutions in multiple languages like **Java, C, C++, and JavaScript**. Designed with a stunning modern UI using **Tailwind CSS** and **Framer Motion**, it offers a seamless and colorful learning experience.

> 🚀 Built by **Sagar **

---

## 📌 Features

- 🔍 Search and filter practical problems
- 🌐 Multi-language code views (Java, C, C++, JS)
- 🎨 Beautiful UI with Tailwind CSS
- 💡 Smooth animations using Framer Motion
- 💾 MongoDB integration to store problems and code
- 📋 Admin form to create and store new problems
- 🧠 Code syntax highlighting (Prism.js or Highlight.js)
- 📱 Responsive design across all devices

---

## 🛠️ Tech Stack

| Frontend        | Backend             | Database  | Styling & Animations |
|-----------------|---------------------|-----------|-----------------------|
| React (Next.js) | Next.js App Router  | MongoDB   | Tailwind CSS, Framer Motion |
|                 | API Routes (server) | Mongoose  | Prism.js (for code)  |

---

## 📂 Project Structure

```

/app
├── page.tsx                  # Home page
├── problems/                 # List of all problems
│     └── \[id]/page.tsx       # Dynamic problem page
├── add/page.tsx              # Admin add problem page
└── layout.tsx                # Root layout

/components
├── ProblemCard.tsx
├── CodeTabs.tsx
└── Navbar.tsx

/lib
└── dbConnect.ts              # MongoDB connection logic

/models
└── Problem.ts                # Mongoose schema

/styles
└── globals.css

/utils
└── languageIcons.ts          # Utility for icons or colors

````

---

## 🧪 MongoDB Schema

```js
// models/Problem.ts
const ProblemSchema = new mongoose.Schema({
  title: String,
  description: String,
  codes: {
    java: String,
    c: String,
    cpp: String,
    js: String
  },
  tags: [String]
});
````

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vastsea.git
cd vastsea
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local` file

```
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---
## 👨‍💻 Contributing

Feel free to fork and contribute to this project. PRs are welcome!

---

## 📄 License

MIT License

---

## 💖 Created By

> **Sagar **
> *Empowering coders through creativity and practical sharing.*

```



