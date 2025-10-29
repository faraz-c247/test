# Authentication Setup Guide

This Next.js application includes a complete authentication system that works with a separate Node.js backend.

## Frontend Features

- ✅ NextAuth.js with JWT strategy
- ✅ TypeScript support with proper types
- ✅ Protected routes with middleware
- ✅ Bootstrap 5 for responsive UI components
- ✅ React Hook Form for form validation and state management
- ✅ Yup schema validation
- ✅ Login, Signup, and Dashboard pages
- ✅ Session management
- ✅ Logout functionality
- ✅ Reusable common components

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Backend API URL
NEXT_PUBLIC_REST_API_ENDPOINT=http://localhost:8000
BACKEND_URL=http://localhost:8000

# Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Backend API Requirements

Your Node.js backend should provide the following endpoints:

### POST /auth/signup
```json
// Request body
{
  "name": "string",
  "email": "string",
  "password": "string"
}

// Response
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "date"
}
```

### POST /auth/login
```json
// Request body
{
  "email": "string",
  "password": "string"
}

// Response
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

### GET /auth/me (Optional)
```json
// Headers
Authorization: Bearer <token>

// Response
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

## Installation & Setup

1. Install dependencies:
```bash
yarn install
```

2. Create your `.env.local` file with the environment variables above.

3. Start your Node.js backend server on port 3001 (or update the environment variables accordingly).

4. Start the Next.js development server:
```bash
yarn dev
```

## File Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API route
│   ├── login/page.tsx                   # Login page
│   ├── signup/page.tsx                  # Signup page
│   ├── dashboard/page.tsx               # Protected dashboard
│   ├── layout.tsx                       # Root layout with SessionProvider
│   ├── globals.css                      # Global styles with Bootstrap
│   └── page.tsx                         # Home page
├── components/
│   ├── common/
│   │   ├── AuthForm.tsx                 # Reusable authentication form
│   │   ├── Navbar.tsx                   # Navigation component
│   │   └── LoadingSpinner.tsx           # Loading component
│   └── SessionProvider.tsx              # NextAuth session provider
├── lib/
│   ├── auth.ts                          # NextAuth configuration
│   ├── api.ts                           # API utilities for backend communication
│   └── validationSchemas.ts             # Yup validation schemas
├── types/
│   ├── auth.ts                          # Authentication types
│   └── next-auth.d.ts                   # NextAuth type extensions
└── middleware.ts                        # Route protection middleware
```

## Key Dependencies

- **Next.js 15**: React framework with App Router
- **NextAuth.js**: Authentication library
- **Bootstrap 5**: CSS framework for responsive design
- **React Bootstrap**: Bootstrap components for React
- **React Hook Form**: Form library with validation
- **Yup**: Schema validation library
- **TypeScript**: Type safety and better development experience

## Form Validation

The application uses React Hook Form with Yup for robust form validation:

### Login Validation
- Email: Required, must be valid email format
- Password: Required, minimum 6 characters

### Signup Validation
- Name: Required, 2-50 characters
- Email: Required, must be valid email format
- Password: Required, minimum 8 characters, must contain uppercase, lowercase, and number

## Common Components

### AuthForm
Reusable form component that handles:
- Form rendering with Bootstrap styling
- Validation error display
- Loading states
- Success/error messages

### Navbar
Navigation component with:
- Responsive design
- Authentication state awareness
- User welcome message
- Logout functionality

### LoadingSpinner
Loading component with:
- Configurable sizes (sm, md, lg)
- Full-screen option
- Custom loading text

## Usage

1. **Home Page** (`/`): Landing page with navigation and feature showcase
2. **Signup** (`/signup`): User registration form with validation
3. **Login** (`/login`): User authentication form with validation
4. **Dashboard** (`/dashboard`): Protected page for authenticated users

## Security Features

- JWT-based session management
- Protected routes with middleware
- Form validation with Yup schemas
- Secure API communication with backend
- TypeScript for type safety
- Error handling and loading states

## Customization

- Update the `NEXT_PUBLIC_REST_API_ENDPOINT` to point to your backend server
- Customize Bootstrap theme in `globals.css`
- Modify validation schemas in `validationSchemas.ts`
- Add additional protected routes in the middleware configuration
- Extend common components for additional functionality

## Stripe Payment Setup

### 1. Get Stripe API Keys

1. Create a Stripe account at https://stripe.com
2. Go to your Stripe Dashboard > Developers > API keys
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 2. Test Cards (for development)

Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires 3D Secure**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

### 3. Webhook Setup (Optional)

For production, set up webhooks in Stripe Dashboard:
1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/v1/subscription/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## Notes

- The frontend communicates with your backend API for user authentication
- Sessions are managed client-side using NextAuth.js
- All passwords should be hashed in your backend before storage
- Make sure to use HTTPS in production and update the `NEXTAUTH_URL` accordingly
- Bootstrap icons are referenced but not included - add Bootstrap Icons if you want to display the icons on the home page
- Use Stripe's production keys only in production environment
- Never expose secret keys in frontend code 