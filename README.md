# **Modern Furniture House \- E-commerce Platform**

A full-stack e-commerce application for a modern furniture store, built with React, Supabase, and Stripe. This project is designed to be a fully-featured, professional, and scalable online retail platform, complete with multi-language support for both English and Arabic.

**Live Demo:** \[Link to your deployed Vercel site\]

## **Table of Contents**

* [Project Overview](https://www.google.com/search?q=%23project-overview)  
* [Core Features](https://www.google.com/search?q=%23core-features)  
* [Advanced & Localization Features](https://www.google.com/search?q=%23advanced--localization-features)  
* [Tech Stack & Tools](https://www.google.com/search?q=%23tech-stack--tools)  
* [File Structure](https://www.google.com/search?q=%23file-structure)  
* [Getting Started](https://www.google.com/search?q=%23getting-started)  
* [Development Phases](https://www.google.com/search?q=%23development-phases)

## **Project Overview**

This project is a comprehensive e-commerce solution for selling high-quality furniture online. The primary goal is to create a seamless, intuitive, and secure shopping experience for customers from browsing products to checkout. It serves as a portfolio piece to demonstrate proficiency in full-stack development, including frontend UI/UX with React, backend services with Supabase, secure payments, and professional development practices like internationalization (i18n).

## **Core Features**

* **Product Catalog:** A clean and modern interface to browse, search, and view all furniture items.  
  * Homepage with featured products and categories.  
  * A main /products page with a grid of all items.  
  * A detailed page for each individual product.  
* **Product Filtering & Sorting:**  
  * Filter products by category (e.g., Living Room, Bedroom).  
  * Sort products by price (low-high, high-low) or newest arrivals.  
* **Shopping Cart:**  
  * Allow users (including guests) to add, remove, and update item quantities.  
  * A persistent cart for logged-in users that syncs across devices.  
  * Clear summary of the total price.  
* **Secure Checkout:**  
  * Multi-step checkout process for shipping and payment information.  
  * Secure payment processing integration with **Stripe**.  
* **User Authentication:**  
  * User registration and login with email/password.  
  * Social login support (e.g., Google) for a frictionless experience.  
  * Protected routes for user-specific pages like account and order history.

## **Advanced & Localization Features**

* **Full-Text Search:** A search bar in the navbar to easily find products by name or description.  
* **Product Reviews & Ratings:** Allow logged-in users to leave a star rating and a written review on products.  
* **Wishlist / Favorites:** A heart icon on products that allows users to save items to a personal wishlist.  
* **Pagination:** Efficiently display a large number of products across multiple pages.  
* **Responsive Design:** A mobile-first approach ensuring a seamless experience on all devices.  
* **Localization (English & Arabic):**  
  * A language switcher to toggle between English (EN) and Arabic (AR).  
  * Full **RTL (Right-to-Left)** layout support for Arabic.  
  * All UI text, product details, and currency formats are localized.

## **Tech Stack & Tools**

### **Development Tools**

| Tool | Description |
| :---- | :---- |
| **Node.js** | JavaScript runtime environment |
| **Git** | Version control system |
| **VS Code** | Code editor with recommended extensions (ESLint, Prettier) |

### **Project Libraries**

| Library | Description |
| :---- | :---- |
| **React** | Frontend library for building user interfaces |
| **Vite** | Modern frontend build tool |
| **react-router-dom** | Client-side routing |
| **Bootstrap** | CSS framework for styling and layout |
| **react-bootstrap** | React components for Bootstrap |
| **@supabase/supabase-js** | Official client for interacting with Supabase |
| **@stripe/stripe-js** | Stripe.js library for payment processing |
| **react-i18next** | Framework for internationalization (i18n) |

### **Cloud Environment & Services**

| Service | Use Case |
| :---- | :---- |
| **GitHub** | Code hosting and version control |
| **Supabase** | Backend-as-a-Service (Database, Auth, Storage) |
| **Vercel** | Frontend hosting and deployment |
| **Stripe** | Secure payment gateway |

## **File Structure**

The project follows a modular, feature-based file structure for scalability and maintainability.

/src/  
├── assets/         \# Static assets like images, fonts  
├── components/     \# Reusable UI components (layout, ui)  
├── context/        \# Global state management (Auth, Cart, Language)  
├── hooks/          \# Custom React hooks for reusable logic  
├── i18n/           \# Translation files (en.json, ar.json)  
├── pages/          \# Page-level components  
├── services/       \# API interaction logic (Supabase client, product service)  
├── utils/          \# Helper functions (e.g., formatCurrency)  
├── App.jsx         \# Main app component with routing  
└── main.jsx        \# Application entry point

## **Getting Started**

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### **Prerequisites**

* Node.js (LTS version) installed  
* Git installed  
* A Supabase account (free tier)  
* A Stripe account (free tier for test mode)

### **Installation**

1. **Clone the repository:**  
   git clone https://github.com/abdullah-m-omar/furniture_store.git  
   cd furniture-store

2. **Install NPM packages:**  
   npm install

3. **Set up environment variables:**  
   * Create a file named .env.local in the root of your project.  
   * Go to your Supabase project settings to find your API keys.  
   * Add the following variables to your .env.local file:

VITE\_SUPABASE\_URL=your\_supabase\_project\_url  
VITE\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key  
VITE\_STRIPE\_PUBLISHABLE\_KEY=your\_stripe\_publishable\_key

4. **Run the development server:**  
   npm run dev

   Open [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) to view it in the browser.

## **Development Phases**

This project was built using a strategic, layered approach to ensure a solid foundation and manage complexity.

* **Phase 1 – Visual Foundation (UI & Layout):** The initial focus was on building the complete user interface with static, hardcoded data. This included setting up routing, creating all components (Navbar, ProductCard, etc.), and styling them to perfection.  
* **Phase 2 – Backend Connection (Data Fetching):** The static UI was then brought to life by connecting it to the Supabase backend. Fake data was replaced with real-time data fetched via API calls, populating the product and detail pages.  
* **Phase 3 – Adding Logic & Interactivity:** With the UI and data layers in place, the final phase involved implementing complex application logic, including the shopping cart (CartContext), user authentication (AuthContext), and localization (i18next).