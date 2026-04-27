# 🏠 Ghoroa Guru – Smart Helping Hand Management System

A modern React + Firebase web application to find and book household helpers across Dhaka.

---

## 🚀 Setup Instructions

### Step 1: Install Node.js
Download from: https://nodejs.org (version 18 or higher)

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Firebase Setup (REQUIRED)

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → Name it "ghoroa-guru"
3. Once created, click **"Add app"** → choose **Web (</>)**
4. Register app → copy the `firebaseConfig` object

5. Open `src/firebase.js` and replace the placeholder values:
```js
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **Enable Google Authentication:**
   - Firebase Console → Authentication → Sign-in method → Google → Enable

7. **Enable Realtime Database:**
   - Firebase Console → Realtime Database → Create database
   - Choose location (asia-southeast1 recommended for BD)
   - Start in **test mode** for development

8. **Set Database Rules** (for development):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Step 4: Run the app
```bash
npm run dev
```
Then open: http://localhost:5173

### Step 5: Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LoadingScreen.jsx   # Initial loading animation
│   ├── Navbar.jsx          # Navigation bar
│   ├── ProviderCard.jsx    # Helper profile card
│   └── StarRating.jsx      # Star rating component
├── context/
│   └── AuthContext.jsx     # Firebase auth context
├── data/
│   └── providers.js        # Bangladeshi names + helper generator
├── pages/
│   ├── LandingPage.jsx     # Google login + splash screen
│   ├── HomePage.jsx        # Dashboard home
│   ├── AboutPage.jsx       # About us
│   ├── ServicesPage.jsx    # Services list
│   ├── FindingPersonPage.jsx  # Main search feature
│   ├── ProviderDetailPage.jsx # Helper profile detail
│   ├── BookingPage.jsx     # Book a helper
│   └── ProfilePage.jsx     # User profile + bookings
├── App.jsx                 # Routes
├── main.jsx               # Entry point
├── index.css              # Tailwind + custom styles
└── firebase.js            # Firebase config ⚠️ Update this!
```

---

## ✨ Features

- 🔐 Google Authentication (Firebase)
- 🗺️ 10 Dhaka Zones with 30 helpers each (300 total)
- 👨👩 Gender filter (Male / Female)
- 🔍 Search by name, area, or service
- ⭐ Ratings and experience levels
- 📅 Booking system (hours / days / months)
- 💰 Dynamic pricing based on experience
- 🔒 Real-time booking availability (Firebase Realtime DB)
- 👤 Personal dashboard with booking history
- 📱 Fully responsive (mobile + desktop)

---

## 🛠️ Tech Stack

- **React 18** + JSX
- **Tailwind CSS** 
- **Framer Motion** (animations)
- **Firebase** (Auth + Realtime Database)
- **React Router v6**
- **React Hot Toast** (notifications)
- **React Icons**
- **Vite** (build tool)
