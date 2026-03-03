# Ledger SaaS Web Application

Production-ready ledger management built with Node.js, Express, MongoDB, and EJS, following MVC pattern.

## Features

- User registration with email OTP verification
- Password hashing with bcrypt
- Session-based authentication (`express-session` + `connect-mongo`)
- Role-based access
- Ledger system: add clients, record credit/debit, search, delete
- Production middlewares: Helmet, compression, morgan
- Responsive UI with Bootstrap 5

## Folder Structure

```
config/
  db.js
controllers/
  authController.js
  ledgerController.js
middleware/
  auth.js
  errorHandler.js
models/
  User.js
  Otp.js
  Client.js
routes/
  auth.js
  ledger.js
views/
  partials/
    navbar.ejs
  register.ejs
  login.ejs
  ledger.ejs
  error.ejs
public/
  css/style.css
  js/app.js
app.js
package.json
.env.example
.gitignore
```

## Getting Started (Local)

1. Clone repository and `cd` into folder.
2. Copy `.env.example` to `.env` and fill values (Mongo URI, SMTP credentials, session secret).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in browser.

## Deployment (Render or similar)

- Push code to GitHub.
- Create a new Render web service (Node environment).
- Set build command: `npm install && npm run build` (no build step needed).
- Set start command: `npm start`.
- Add environment variables in dashboard matching `.env` keys.
- For production, ensure `NODE_ENV=production` and `SESSION_SECRET` is strong.
- `connect-mongo` will store sessions in Atlas.
- Secure cookies are automatically enabled when `NODE_ENV` is production.

## Notes

- OTP logic prevents multiple resends before expiry.
- Users cannot log in until verified.
- All ledger routes guard with session check.
- Add additional role checks using `ensureRole` middleware if needed.

Feel free to extend with password reset, pagination, and better UI.
