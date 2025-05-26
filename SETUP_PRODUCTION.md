# 🚀 The Pilgrim - Production Setup Guide

## Prerequisites

1. **Supabase Account** - Create a project at [supabase.com](https://supabase.com)
2. **Stripe Account** - Sign up at [stripe.com](https://stripe.com)
3. **Vercel Account** - Deploy at [vercel.com](https://vercel.com)
4. **Resend Account** (optional) - For emails at [resend.com](https://resend.com)

## 🛠️ Setup Instructions

### 1. Configure Supabase

1. Create a new Supabase project
2. Go to SQL Editor and run these scripts in order:
   ```sql
   -- First, run the schema
   database/schema-updated.sql
   
   -- Then, migrate the data
   database/migrate-real-data.sql
   
   -- Finally, create admin users
   database/create-admin-user.sql
   ```

3. Create an admin user in Supabase Auth:
   - Go to Authentication > Users
   - Create user with email: `admin@thepilgrim.com`
   - Set a secure password

4. Get your credentials:
   - Go to Settings > API
   - Copy: `URL`, `anon public key`, `service_role secret`

### 2. Configure Stripe

1. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your test keys: `Publishable key` and `Secret key`
3. Set up webhook endpoint:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the webhook signing secret

### 3. Environment Variables

1. In Vercel, go to Settings > Environment Variables
2. Add these variables:

```env
# Supabase (from step 1)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (from step 2)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Optional: Email with Resend
RESEND_API_KEY=re_your_key
EMAIL_FROM_ADDRESS=hola@your-domain.com
EMAIL_FROM_NAME=The Pilgrim

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. Deploy to Vercel

1. Connect your GitHub repository
2. Deploy with automatic builds
3. Verify all environment variables are set
4. Test the deployment

## 🧪 Testing

### Test Payment Flow:
1. Use Stripe test cards: `4242 4242 4242 4242`
2. Any future date and CVC
3. Complete a test purchase

### Test Admin Panel:
1. Go to `/admin/login`
2. Login with your admin credentials
3. Verify access to all sections

## 📋 Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] Admin user can login
- [ ] Countries data loads in dashboard
- [ ] Filters work and persist
- [ ] Payment checkout works
- [ ] Email notifications sent (if configured)
- [ ] All pages load without errors

## 🛡️ Security Notes

1. **Never commit `.env.local`** to version control
2. Use strong passwords for admin accounts
3. Enable 2FA on Supabase and Stripe
4. Regularly rotate API keys
5. Monitor webhook logs for suspicious activity

## 🆘 Troubleshooting

### Countries not loading:
- Check Supabase connection
- Verify RLS policies are correct
- Check browser console for errors

### Payments not working:
- Verify Stripe keys are correct
- Check webhook configuration
- Look at Stripe logs

### Admin can't login:
- Ensure user exists in both Supabase Auth and admin_users table
- Check middleware configuration
- Verify cookies are enabled

## 📞 Support

For issues or questions:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Check Stripe webhook logs
4. Contact support with error details

---

**Remember**: Always test thoroughly in development before deploying to production!