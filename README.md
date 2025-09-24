# RefedConnect - Food Sharing Platform

*A comprehensive platform connecting food donors with NGOs and biogas agents*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/cse22148-1595s-projects/v0-project-refed-connect)

## Overview

RefedConnect is a food sharing platform that connects:
- **Donors**: Share excess food with those in need
- **NGO Agents**: Manage food distribution to communities  
- **Biogas Agents**: Convert organic waste into renewable energy

## Features

- Real-time GPS tracking and navigation
- Google OAuth authentication
- Role-based dashboards
- Interactive maps with directions
- Food donation management
- Waste collection scheduling

## Deployment

Your project is live at:

**[https://vercel.com/cse22148-1595s-projects/v0-project-refed-connect](https://vercel.com/cse22148-1595s-projects/v0-project-refed-connect)**

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables for Google OAuth
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

## Technology Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Google Maps API
- Google OAuth
