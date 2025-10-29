# Stripe Payment Integration Setup

## Overview

This application uses Stripe for secure payment processing. The integration includes:

- **Frontend**: React Stripe.js for secure card collection
- **Backend**: Stripe Node.js SDK for payment processing
- **Flow**: Payment Intent API for secure, modern payments

## Required API Keys

You'll need these Stripe API keys:

### For Frontend (.env.local)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
```

### For Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## Getting Your Stripe Keys

### 1. Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete your account verification

### 2. Get API Keys
1. Go to **Developers > API keys** in your Stripe Dashboard
2. Copy the **Publishable key** (starts with `pk_test_` for test mode)
3. Click "Reveal test key" for the **Secret key** (starts with `sk_test_`)

### 3. Test Mode vs Live Mode
- **Test Mode**: Use for development (keys start with `pk_test_` and `sk_test_`)
- **Live Mode**: Use for production (keys start with `pk_live_` and `sk_live_`)

## Test Cards for Development

Use these test card numbers during development:

### Successful Payments
- **Visa**: 4242 4242 4242 4242
- **Visa (debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444

### Failed Payments
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995
- **Invalid CVC**: 4000 0000 0000 0127

### Special Cases
- **Requires 3D Secure**: 4000 0025 0000 3155
- **Requires 3D Secure 2**: 4000 0027 6000 3184

**For all test cards:**
- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

## Payment Flow

### 1. User Selects Plan
- User clicks on a subscription plan
- Frontend shows payment modal with plan details

### 2. Create Payment Intent
- Frontend calls `/api/v1/subscription/create-payment-intent`
- Backend creates Stripe Payment Intent
- Returns client secret to frontend

### 3. Collect Payment
- Frontend uses Stripe Elements to collect card details
- Stripe securely processes payment
- No card details touch your servers

### 4. Complete Purchase
- Frontend calls `/api/v1/subscription/complete-purchase`
- Backend verifies payment with Stripe
- Credits are added to user account

## API Endpoints

### POST /api/v1/subscription/create-payment-intent
Creates a Stripe Payment Intent for the selected plan.

**Request:**
```json
{
  "planId": "64f8b1234567890abcdef123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment intent created successfully",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### POST /api/v1/subscription/complete-purchase
Completes the purchase after successful Stripe payment.

**Request:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription purchased successfully",
  "data": {
    "userCredits": {
      "id": "xxx",
      "totalCredits": 20,
      "remainingCredits": 20,
      "expirationDate": "2025-01-15T00:00:00.000Z"
    }
  }
}
```

## Frontend Components

### PaymentForm
- Handles Stripe card collection
- Manages payment processing
- Shows loading states and errors
- Securely submits payments

### PurchasePlansPage
- Displays subscription plans
- Shows current user credits
- Handles plan selection
- Integrates with Stripe payment flow

## Security Features

### Frontend Security
- Card details never touch your servers
- Stripe Elements handles PCI compliance
- Client-side validation and error handling
- Secure token-based authentication

### Backend Security
- Payment verification with Stripe
- User authentication required
- Input validation and sanitization
- Secure API key management

## Development Setup

### 1. Install Dependencies

**Frontend:**
```bash
yarn add @stripe/stripe-js @stripe/react-stripe-js
```

**Backend:**
```bash
yarn add stripe
```

### 2. Environment Variables

Create `.env.local` in frontend:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

Create `.env` in backend:
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### 3. Test the Integration

1. Start backend server: `yarn dev`
2. Start frontend: `yarn dev`
3. Login with a user account
4. Go to Purchase Plans page
5. Select a plan and use test card: `4242 4242 4242 4242`
6. Complete payment and verify credits are added

## Production Deployment

### 1. Switch to Live Mode
- Replace test keys with live keys
- Update environment variables in production

### 2. Webhook Configuration
- Set up webhooks for payment confirmations
- Handle payment failures and disputes
- Implement proper error logging

### 3. Security Checklist
- Use HTTPS everywhere
- Validate webhook signatures
- Log payment events securely
- Monitor for suspicious activity

## Troubleshooting

### Common Issues

1. **"Stripe has not been initialized"**
   - Check that NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set
   - Verify the key format (should start with pk_)

2. **"No such payment_intent"**
   - Verify payment intent ID is correct
   - Check that payment was created successfully

3. **"Invalid API key"**
   - Verify secret key is correct
   - Check you're using the right test/live mode

4. **Card declined**
   - Use valid test card numbers
   - Check card details are entered correctly

### Debug Tips

- Check browser console for Stripe errors
- Monitor Stripe Dashboard for payment attempts
- Verify API responses in network tab
- Test with different card numbers

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: Available in your Stripe Dashboard
- **Test Cards**: https://stripe.com/docs/testing#cards 

## 📍 Where to Add Stripe Keys

### 1. Frontend Environment File
**File**: `/home/asd/Documents/rentintel/.env.local`

Add this line to your existing `.env.local` file:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

So your complete `.env.local` should look like:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXT_PUBLIC_REST_API_ENDPOINT=http://localhost:8000/api/v1
BACKEND_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 2. Backend Environment File
**File**: `/home/asd/rentIntel-backend-apis-master (1)/rentIntel-backend-apis-master/.env`

Replace the placeholder values for these lines:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🔑 How to Get Your Stripe Keys

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Start now" and create your account
3. Complete the verification process

### Step 2: Get Your API Keys
1. Go to your **Stripe Dashboard**
2. Click **Developers** in the left sidebar
3. Click **API keys**
4. You'll see:
   - **Publishable key**: Starts with `pk_test_` (for frontend)
   - **Secret key**: Click "Reveal test key" to see it, starts with `sk_test_` (for backend)

### Step 3: Copy the Keys
- Copy the **Publishable key** and add it to `/home/asd/Documents/rentintel/.env.local`
- Copy the **Secret key** and replace the placeholder in `/home/asd/rentIntel-backend-apis-master (1)/rentIntel-backend-apis-master/.env`

## 🧪 Test Cards (No Real Money)

Once you have the keys set up, you can test with these cards:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (like 12/25)
- **CVC**: Any 3 digits (like 123)
- **ZIP**: Any ZIP code (like 12345)

## ⚡ After Adding Keys

1. Restart both servers (frontend and backend)
2. Login to your app
3. Go to Purchase Plans
4. Select any plan and test the payment flow

The payment integration is fully implemented and ready to use once you add your Stripe keys! 