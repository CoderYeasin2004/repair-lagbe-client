# RepairLagbe – Frontend

RepairLagbe is an on-demand device and home appliance repair booking platform. Customers can find repair services and book technicians, while technicians can manage their services and booking requests. Admins can manage users, services, bookings, and transactions.

## Live Demo

- Live Website: `repair-lgbe-client.vercel.app`
- Backend API: `repair-lgbe-server.vercel.app`

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Better Auth
- next-themes
- Stripe Checkout

## Features

### Public
- Browse available repair services
- View service details
- Search and filter services
- User registration and login

### Customer
- Customer dashboard
- Browse and book repair services
- View booking history
- Cancel eligible bookings
- Make payments through Stripe
- View payment history

### Technician
- Technician dashboard
- Add and manage repair services
- Edit and delete own services
- Manage service availability
- View and manage booking requests

### Admin
- Admin dashboard with overview statistics
- Manage users and user roles
- Approve or reject technician services
- View all bookings
- View payment transactions and revenue

## Installation

Clone the repository:


git clone YOUR_FRONTEND_GITHUB_URL


Go to the project directory:


cd repair-lgbe-client


Install dependencies:


npm install


## Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables.


NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
NEXT_PUBLIC_APP_URL=YOUR_FRONTEND_URL


Add any other environment variables required by your local authentication, image upload, and payment configuration.

## Run Locally

Start the development server:


npm run dev


Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production


npm run build


Start the production server:


npm run start


## Deployment

The frontend can be deployed on Vercel.

Before deployment:
- Configure the required environment variables.
- Set the correct backend API URL.
- Configure the authentication trusted origin.
- Make sure the backend API is accessible.

## Project Structure


repair-lgbe-client/
├── app/
├── components/
├── lib/
├── public/
├── package.json
└── README.md


