# SendGrid Setup for Contact Form

This guide will help you set up SendGrid for the contact form functionality.

## 1. Create a SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/) and create an account
2. Verify your account through email

## 2. Create an API Key

1. Log in to your SendGrid dashboard
2. Go to **Settings** > **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access** and give it the following permissions:
   - **Mail Send**: Full Access
5. Copy the API key (you won't be able to see it again)

## 3. Verify Your Sender Identity

1. Go to **Settings** > **Sender Authentication**
2. Choose **Single Sender Verification**
3. Add your email address (e.g., noreply@yourdomain.com)
4. Verify the email address

## 4. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
ADMIN_EMAIL=admin@rentintel.com
FROM_EMAIL=noreply@rentintel.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 5. Test the Contact Form

1. Start your development server: `yarn dev`
2. Go to `/contact-us`
3. Fill out and submit the contact form
4. Check your admin email for the notification
5. Check the user's email for the auto-reply

## Email Templates

The contact form sends two emails:

### 1. Admin Notification Email
- Sent to the admin email address
- Contains all form details
- Includes submission timestamp

### 2. Auto-Reply Email
- Sent to the user who submitted the form
- Professional thank you message
- Includes links to signup and about pages

## Troubleshooting

### Common Issues:

1. **"Forbidden" Error**: Check your API key permissions
2. **"Unauthorized" Error**: Verify your API key is correct
3. **Emails not sending**: Check your sender verification status
4. **Spam folder**: Check if emails are going to spam

### Testing Without SendGrid:

If you don't want to set up SendGrid immediately, the contact form will still work but won't send emails. The form data will be logged to the console instead.

## Production Setup

For production:

1. Use a verified domain instead of single sender
2. Set up domain authentication
3. Configure proper SPF, DKIM, and DMARC records
4. Use environment variables for all sensitive data
5. Consider rate limiting for the contact form

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider implementing rate limiting
- Validate all form inputs on both client and server
- Use HTTPS in production
