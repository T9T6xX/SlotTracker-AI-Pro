# SlotTracker AI Pro - Setup Instructions

## 🚀 Firebase Authentication Setup

Euer Projekt ist jetzt mit Firebase Authentication ausgestattet! Folgt diesen Schritten:

### 1. Firebase Console Setup

1. Geht zu [Firebase Console](https://console.firebase.google.com/)
2. Wählt euer Projekt **"slotaitool"** aus (oder erstellt es, falls nicht vorhanden)
3. Im linken Menü: **Build** → **Authentication** klicken
4. Klickt auf **"Get Started"**

### 2. Authentication-Methoden aktivieren

#### Email/Password aktivieren:
1. Im Authentication-Tab: **Sign-in method** wählen
2. **Email/Password** anklicken
3. Den ersten Schalter auf **"Enable"** setzen
4. **Speichern**

#### Google Sign-In aktivieren (optional aber empfohlen):
1. **Google** in der Liste anklicken
2. **Enable** aktivieren
3. **Support email** auswählen (eure Email)
4. **Speichern**

### 3. Firebase Config-Daten holen

1. In Firebase Console: **Projekt-Einstellungen** (Zahnrad-Symbol oben links)
2. Scrollt runter zu **"Ihre Apps"**
3. Falls noch keine Web-App: Klickt auf **"</>" (Web-Symbol)**
   - App-Namen: "SlotTracker AI Pro"
   - Firebase Hosting: **nicht** aktivieren
   - **App registrieren** klicken
4. Kopiert die Werte aus dem **firebaseConfig** Objekt

### 4. Environment Variables einrichten

1. Kopiert `.env.local.example` zu `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Öffnet `.env.local` und tragt eure Firebase-Daten ein:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=slotaitool.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=slotaitool
   VITE_FIREBASE_STORAGE_BUCKET=slotaitool.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:...
   ```

### 5. Dependencies installieren

```bash
npm install firebase react-router-dom
```

### 6. App starten

```bash
npm run dev
```

## 📱 Neue Routen

Eure App hat jetzt folgende Routen:

- **`/`** - Landing Page (öffentlich)
- **`/login`** - Login/Signup Seite (öffentlich)
- **`/dashboard`** - Haupt-Dashboard mit AI-Tracker (geschützt, nur nach Login)

## 🔐 Wie es funktioniert

### Landing Page (`/`)
- Zeigt Feature-Übersicht
- CTA-Buttons für Login/Signup
- Automatische Weiterleitung zum Dashboard wenn bereits eingeloggt

### Login Page (`/login`)
- Email/Password Login
- Google Sign-In Button
- Wechsel zwischen Login und Signup
- Automatische Weiterleitung zum Dashboard nach erfolgreichem Login

### Dashboard (`/dashboard`)
- Euer komplettes AI-Dashboard (ehemals App.tsx)
- Nur für eingeloggte Benutzer zugänglich
- Logout-Button in der Navigation
- Zeigt Email des eingeloggten Users

### Protected Routes
- Alle geschützten Routen prüfen automatisch den Login-Status
- Nicht-eingeloggte User werden zu `/login` weitergeleitet
- Nach Login werden User automatisch zum Dashboard weitergeleitet

## 🎨 Anpassungen

### Landing Page Text ändern
Datei: `src/pages/LandingPage.tsx`

### Login Page Design ändern
Datei: `src/pages/LoginPage.tsx`

### Dashboard anpassen
Datei: `src/pages/Dashboard.tsx`

## 🐛 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
→ Prüft eure `.env.local` Datei und Firebase Config

### "Module not found: Can't resolve 'firebase'"
→ Führt `npm install` aus

### User wird nicht weitergeleitet nach Login
→ Öffnet Browser DevTools → Console für Fehlermeldungen

### Google Sign-In funktioniert nicht
→ Prüft ob Google Sign-In in Firebase Console aktiviert ist

## 📚 Nächste Schritte

- [ ] Firebase Setup abschließen
- [ ] Test-Account erstellen
- [ ] Landing Page Text anpassen
- [ ] Logo/Branding hinzufügen
- [ ] Firestore Database für User-Daten (optional)
- [ ] Email-Verifizierung aktivieren (optional)
- [ ] Password Reset Funktion (optional)

## 🎉 Los geht's!

Nach dem Setup könnt ihr:
1. Neue Accounts erstellen
2. Mit Email/Password oder Google einloggen
3. Das Dashboard mit allen Features nutzen
4. Sicher aus- und einloggen

Viel Erfolg! 🚀