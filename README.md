# Bloggr - A Modern Full-Stack Blogging Platform

![Bloggr Screenshot](https://res.cloudinary.com/dm9jqz1pv/image/upload/v1758285286/blog_post_images/sft6zluoyujzkkcgiu2i.png)

---

### A Next.js & Node.js Blogging Application

Bloggr is a feature-rich, full-stack blogging platform built from the ground up with a modern, scalable, and type-safe technology stack. This project demonstrates a complete development lifecycle, from robust backend API design to a dynamic, server-rendered React frontend, culminating in a production-ready deployment on Vercel.

This repository serves as a comprehensive example of professional full-stack development, featuring user authentication, a rich text editor, post interactions, and a database-driven content system.

**Live Demo:** [**https://www.bloggr.space**](https://www.bloggr.space)

## Key Features

*   **✍️ Rich Text Editor:** A block-based Tiptap editor for creating and editing posts.
*   **🖼️ Direct Image Uploads:** Secure, signed-upload workflow directly from the editor to Cloudinary.
*   **🔐 User Authentication:** Full auth system with JWTs stored in secure `httpOnly` cookies (signup, login, logout).
*   **👤 Anonymous & Guest Sessions:** Tracks user views and interactions even for non-logged-in users.
*   **👍 Post Interactions:** Users can like, comment on, and bookmark posts.
*   **👤 User Profiles:** Dynamic user profile pages with followers, following, and a feed of their posts.
*   **🏷️ Dynamic Tagging System:** A database-driven tag and category system for content discovery.
*   **🚀 Performance Optimized:** Uses Next.js Server Components, skeleton loaders, and database indexing for blazing-fast load times.
*   **📱 Fully Responsive:** A clean, modern UI that works beautifully on desktop and mobile devices.
*   **🔒 Protected Routes:** Server-side redirects for protected pages like `/write` and `/settings`.

## Tech Stack

This project is a monorepo containing two separate applications: a `frontend` and a `backend`.

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **Next.js** | Full-stack React Framework (App Router) |
| **React** | UI Library (Server & Client Components) |
| **TypeScript** | Language for Type Safety |
| **Tailwind CSS** | Utility-First CSS Framework |
| **Shadcn/ui & Radix UI**| UI Component Library |
| **Tiptap** | Headless Rich Text Editor |
| **SWR** | Client-Side Data Fetching & Caching |

### Backend

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | JavaScript Runtime Environment |
| **Express.js** | Web Application Framework |
| **TypeScript** | Language for Type Safety |
| **MongoDB** | NoSQL Database |
| **Mongoose** | Object Data Modeler (ODM) for MongoDB |
| **JWT** | Secure User Authentication Tokens |
| **Cloudinary** | Cloud-based Image & Media Management |

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   A local MongoDB instance or a free MongoDB Atlas cluster
*   A free Cloudinary account

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/Bloggr.git
    cd Bloggr
    ```

2.  **Backend Setup:**
    ```sh
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory by copying `.env.example`.
    *   Fill in your `MONGODB_URI`, a secret `JWT_SECRET`, and your Cloudinary credentials.
    *   Seed the database with initial tags:
        ```sh
        npm run seed
        ```
    *   Start the backend server:
        ```sh
        npm run dev
        ```
    The backend will be running on `http://localhost:5050`.

3.  **Frontend Setup:**
    *   Open a **new terminal window**.
    ```sh
    cd frontend
    npm install
    ```
    *   Create a `.env.local` file in the `frontend` directory by copying `.env.local.example`.
    *   Fill in your `NEXT_PUBLIC_API_URL` (which should be `http://localhost:5050`) and your public Cloudinary credentials.
    *   Start the frontend server:
        ```sh
        npm run dev
        ```
    The frontend will be running on `http://localhost:3000`.

### Environment Variables

You will need to create the following `.env` files:

*   **`backend/.env`**
    ```
    PORT=5050
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_string
    CORS_ORIGIN=http://localhost:3000
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

*   **`frontend/.env.local`**
    ```
    NEXT_PUBLIC_API_URL=http://localhost:5050
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
    ```

## Deployment

This application is designed for and deployed on **Vercel**.
*   The **frontend** is deployed as a Next.js project from the `/frontend` directory, live at `https://www.bloggr.space`.
*   The **backend** is deployed as a Vercel Node.js Serverless Function from the `/backend` directory, live at `https://api.bloggr.space`.

Environment variables for production must be configured in the Vercel project settings for each respective project.

---

## Contact

Aditya Png - [@adit_shrma](https://x.com/adit_shrma)

Project Link: [https://github.com/Adityapng/Bloggr](https://github.com/Adityapng/Bloggr)
