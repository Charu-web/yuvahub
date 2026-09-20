# YuvaHub — Career & Community Portal

A responsive web portal connecting job candidates and recruiters to career development resources, event registrations (Rojgar Melava), and opportunity directories.

## Overview

YuvaHub provides an accessible, mobile-first web experience with dynamic candidate registration workflows, email notifications via Nodemailer SMTP, recruitment directory filters, and multi-language support.

## Key Features

- **Candidate Registration Workflow**: Dynamic multi-step forms for job seekers and recruiter registrations.
- **Automated Email Confirmations**: Gmail SMTP integration with Nodemailer for confirmation receipts.
- **Recruiter Directory**: Interactive listing of recruiting companies and opportunity sectors.
- **Responsive Media Layouts**: Mobile, tablet, and desktop banners with optimized srcset loading.

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, Nodemailer SMTP, CORS, Dotenv
- **Tooling**: PostCSS, Concurrently, Vite Build Engine

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Charu-web/yuvahub.git
   cd yuvahub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and configure SMTP credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## Author

**Charu Sonker**  
Full Stack Developer | AI-Integrated Web Applications  
[GitHub](https://github.com/Charu-web) · [Portfolio](https://charusonker.dev)
