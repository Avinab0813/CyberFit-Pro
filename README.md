<div align="center">
  <img src="./assets/icon.png" width="120" />
  <h1>⚡ CyberFit Pro</h1>
  <p><strong>Next-Gen AI Fitness Command Center</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React%20Native-0.72-blue?style=for-the-badge&logo=react" />
    <img src="https://img.shields.io/badge/Expo-SDK%2052-black?style=for-the-badge&logo=expo" />
    <img src="https://img.shields.io/badge/AI-Pollinations-purple?style=for-the-badge&logo=openai" />
    <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green?style=for-the-badge&logo=android" />
  </p>

  <h3>
    <a href="#-download-apk">📲 Download Android APK</a>
    <span> | </span>
    <a href="#-installation">🛠 Installation</a>
  </h3>
</div>

---

## 💡 About The Project

**CyberFit Pro** is a production-grade fitness application designed for athletes who demand data precision. It bridges the gap between **Biometric Analysis** and **AI Coaching**.

Unlike standard fitness apps, CyberFit features a **"Biological Engine"** that auto-calculates TDEE and BMR based on user stats, combined with a **Tactical GPS Tracker** that works without expensive API keys.

---

## 📸 Interface Gallery

| **Tactical Dashboard** | **AI Neural Coach** | **Workout Plans** | **Bio-Metrics Profile** |
|:---:|:---:|:---:|:---:|
| <img src="./assets/screenshots/home.png" width="200" /> | <img src="./assets/screenshots/ai.png" width="200" /> | <img src="./assets/screenshots/plans.png" width="200" /> | <img src="./assets/screenshots/profile.png" width="200" /> |

---

## 🚀 Key Features

### 🧠 FitCoach AI (Powered by LLMs)
*   Integrated **Chatbot** optimized for fitness and nutrition queries.
*   Provides real-time workout modifications and diet plans.
*   **Zero-Config:** Uses open-source Pollinations API for unlimited free usage.

### 📍 Tactical GPS Tracker
*   **OpenStreetMap (OSM)** Engine: Custom implementation using `react-native-webview` to bypass Google Maps costs.
*   **Hype Mode:** Floating Glassmorphism Music Widget overlay on the map.
*   **Live Metrics:** Real-time Pace, Distance, and Duration tracking.

### 🧬 Biological Engine
*   **Auto-Calc:** Instantly calculates **BMR** (Basal Metabolic Rate) and **TDEE** using the *Mifflin-St Jeor Equation*.
*   **Dynamic Goals:** Calorie targets update automatically based on activity level (Sedentary vs Athlete).

### 🛡️ Security & UX
*   **Biometric Login:** FaceID / Fingerprint authentication using `expo-local-authentication`.
*   **Haptic Feedback:** Physical vibrations for button presses and timer completions.
*   **Offline First:** Uses `AsyncStorage` to persist all data locally on the device.

---

## 📲 Download APK

You can download the latest Android Build directly here:

> **[📥 Download CyberFit Pro (v1.0)](YOUR_LINK_GOES_HERE)**

*(Note: This is a direct APK file. You may need to "Allow Install from Unknown Sources" on your device.)*

---

## 🛠 Tech Stack

*   **Core:** React Native, Expo (SDK 52)
*   **Navigation:** React Navigation (Bottom Tabs)
*   **State/Storage:** React Hooks, AsyncStorage
*   **Hardware:** Expo Sensors (Pedometer), Expo Location, Expo Haptics
*   **UI:** Linear Gradient, Vector Icons, React Native Chart Kit

---

## ⚙️ Installation

To run this project locally:

1.  **Clone the repo**
    ```bash
    git clone https://github.com/YOUR_USERNAME/CyberFit-Pro.git
    cd CyberFit-Pro
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the server**
    ```bash
    npx expo start --clear
    ```

---

<div align="center">
  <p>Built with ❤️ by <strong>[Avinab Paul]</strong></p>
</div>