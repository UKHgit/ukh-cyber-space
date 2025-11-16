# UKH Cyber Space - Setup Guide

## Contact Form & Authentication Setup

### 🚀 What's Been Implemented

#### ✅ Contact Form (Netlify Forms)
- **Automatic form handling** via Netlify Forms
- **Spam protection** with honeypot field
- **Form validation** with required fields
- **Thank you page** with auto-redirect
- **Mobile-responsive** design

#### ✅ Authentication System
- **Local storage-based** authentication (perfect for static hosting)
- **User registration** and login
- **Session management** with welcome messages
- **Password validation** and email verification
- **Logout functionality**

### 📧 Setting Up Email Notifications

#### Option 1: Netlify Form Notifications (Recommended)
1. **Deploy your site** to Netlify
2. Go to your **Netlify Dashboard**
3. Navigate to **Site settings > Forms**
4. Click on **Form notifications**
5. Add **Email notification**:
   - **Email to notify**: `your-email@gmail.com`
   - **Subject line**: `New Contact Form Submission - UKH Cyber Space`
   - **Custom email template** (optional):
     ```
     New message from {{name}} ({{email}}):
     
     Phone: {{phone}}
     Message: {{message}}
     
     Submitted at: {{created_at}}
     ```

#### Option 2: Zapier Integration (Advanced)
1. Create a **Zapier account**
2. Set up a **Netlify Forms → Gmail** zap
3. Configure email templates and forwarding

### 📱 Setting Up WhatsApp Integration

#### Update Contact Links
1. **Open `index.html`**
2. **Find this line** (around line 280):
   ```html
   <a href="https://wa.me/1234567890" target="_blank">
   ```
3. **Replace `1234567890`** with your actual WhatsApp number:
   ```html
   <a href="https://wa.me/94771234567" target="_blank">
   ```
   *(Use international format: country code + number without + sign)*

4. **Update email link** (same section):
   ```html
   <a href="mailto:your-email@gmail.com">
   ```
   **Replace with your actual email**:
   ```html
   <a href="mailto:bimsara@example.com">
   ```

#### Also Update Thank You Page
1. **Open `thank-you.html`**
2. **Update the same links** there as well

### 🔧 Advanced Email Setup (Optional)

#### Using EmailJS for Direct Email Sending
If you want emails sent directly from the contact form:

1. **Sign up** at [EmailJS](https://www.emailjs.com/)
2. **Create an email service** (Gmail, Outlook, etc.)
3. **Add this script** to `index.html` before closing `</body>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   <script>
     emailjs.init("YOUR_PUBLIC_KEY");
   </script>
   ```
4. **Update the form submission** in `script.js`

### 🚀 Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add contact form and authentication"
   git push origin main
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repo
   - Deploy from `main` branch
   - Build command: (leave empty)
   - Publish directory: `.` (root)

3. **Configure Form Notifications**:
   - Go to Netlify dashboard after first deployment
   - Set up email notifications as described above

### 📋 Testing Checklist

#### Contact Form Testing
- [ ] Form submits successfully
- [ ] Thank you page displays
- [ ] Email notifications received
- [ ] WhatsApp link opens correctly
- [ ] Spam protection works

#### Authentication Testing
- [ ] User can sign up
- [ ] User can log in
- [ ] Welcome message displays
- [ ] Logout works
- [ ] Session persists on page reload

### 🔒 Security Notes

- **Passwords are hashed** (basic hashing for demo)
- **Form has spam protection** via honeypot
- **HTTPS enforced** via Netlify
- **XSS protection** headers configured

### 📞 Contact Information to Update

**Replace these placeholders with your actual information:**

1. **Email**: `your-email@gmail.com` → Your actual Gmail
2. **WhatsApp**: `1234567890` → Your actual WhatsApp number
3. **Site URL**: Update any hardcoded URLs to your actual Netlify URL

### 🎯 Next Steps

1. **Deploy the site**
2. **Test the contact form**
3. **Set up email notifications**
4. **Update contact information**
5. **Test authentication system**
6. **Customize styling if needed**

### 🆘 Troubleshooting

#### Contact Form Issues
- **Form not submitting**: Check Netlify Forms dashboard
- **No emails received**: Verify notification settings
- **Spam issues**: Check honeypot field implementation

#### Authentication Issues
- **Login not working**: Check browser console for errors
- **Data not persisting**: Verify localStorage is enabled
- **Styling issues**: Check CSS file loading

---

**Your site is now ready for deployment with working contact forms and authentication!** 🚀

For any issues, check the browser console for error messages and verify all configuration steps above.