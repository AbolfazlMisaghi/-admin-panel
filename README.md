‫# Admin Panel (React + Vite)

A modern admin dashboard for managing a team, educational products, and blog articles.  
Built with React and Vite, using a feature-based architecture and mock API for development.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 Overview

This project is a fully functional admin panel for a corporate/academy website. It allows an administrator to:

- Authenticate and log in
- View a dashboard with statistics
- Manage team members (CRUD)
- Manage educational products/apps (CRUD)
- Manage blog articles with SEO fields (CRUD)
- Edit site settings (name, logo, social links)

The frontend is designed to be **backend-agnostic**: currently it uses **MSW (Mock Service Worker)** to simulate a real REST API, so it runs completely in the browser.  
In the future, you can replace the mock with a real backend by just changing the `baseURL` in the Axios instance – no other code changes are needed.

## 🛠 Tech Stack

| Category            | Library / Tool                   |
|---------------------|----------------------------------|
| Build Tool          | Vite                             |
| UI Library          | React 18                         |
| Routing             | React Router v6                  |
| Auth State          | Zustand                          |
| Server State        | TanStack Query (React Query v5)  |
| HTTP Client         | Axios                            |
| Forms & Validation  | React Hook Form + Zod            |
| Mock API            | MSW (Mock Service Worker)        |
| Notifications       | Sonner                           |
| Styling (future)    | Tailwind CSS (planned)           |

## 📁 Project Structure (Feature-based)
src/
features/
admin/ # Admin layout (sidebar, header)
auth/ # Login page, auth store, auth service
dashboard/ # Dashboard with stats
team/ # Team list, team form, team service, schema
products/ # Product list, product form, service, schema
articles/ # Article list, article form, service, schema
settings/ # Settings page, service, schema
common/ # Shared components, services, utils
routes/ # Route definitions, AuthGuard
mocks/ # MSW handlers and in-memory database

text

## 🚀 Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/AbolfazlMisaghi/-admin-panel.git
   cd admin-panel
Install dependencies

bash
npm install
Start the development server

bash
npm run dev
The app will run on http://localhost:5173 with MSW enabled automatically.

Login credentials (for development)

Email: admin@example.com

Password: admin123

Note: All data is stored in memory (MSW). Refreshing the page restores the default mock data.
When connected to a real backend, data will persist normally.

📌 Features
🔐 JWT-like authentication flow (token stored in localStorage)

📊 Dashboard with live counts (team, products, articles)

👥 Team management (name, role, email, photo URL)

📦 Product management (name, description, link, image)

📝 Article management with SEO meta fields:

Title, slug, summary, content

Meta title & meta description

Status (draft/published)

Auto-generated slug from title

⚙️ Site settings (site name, logo, description, social links)

✅ Form validation with Zod schemas

💬 Toast notifications (success/error)

🛡️ Protected routes (redirect to login if not authenticated)

🧩 Fully feature-based architecture for easy scaling

🔮 Future Roadmap
Add Tailwind CSS for styling

Build the public-facing website (team page, products page, blog) with SEO-friendly routing

Replace MSW with a real backend (Node.js/Express or similar)

Add unit/integration tests

📄 License
This project is licensed under the MIT License.
It is intended for portfolio and educational purposes. Commercial use of the project as-is without prior agreement is discouraged, although the license allows it.

Made with ❤️ as a learning project and real-world admin panel exercise.