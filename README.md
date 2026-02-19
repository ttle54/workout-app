# Workout & Nutrition Hub App

A comprehensive mobile application built with **Expo**, **React Native**, and **Expo Router**. This app unifies workout programming, exercise tutorials, macro-level nutrition tracking, and long-term physique/strength progression tracking within a cohesive and rich "Urban Neon" UI design system.

## 📱 Features Implemented To Date

### 1. Exercise Library & Programs
*   **Exercises Tab:** Browse an extensive list of exercises categorized by muscle groups.
*   **Dynamic Program Detail Routing:** Pre-made routines (Beginners, Advanced, Hypertrophy) redirect to detailed `program/[id].tsx` dynamic routes explaining targeted activities.
*   **Video Tutorials:** All tracked activities map to actual embedded YouTube videos rendered via `react-native-youtube-iframe` modals to ensure proper form guidance.

### 2. Nutrition Ecosystem
*   **Daily Log:** Monitor consumption across Breakfast, Lunch, Dinner, and Snacks.
*   **Granular Macros:** State-based tracking computes Calories, Protein, Carbs, Fat, and Fiber, updating charts (via `react-native-chart-kit`) in real time.
*   **Manual Entry:** Simple input modals for ad-hoc manual meal logging.
*   **"AI" Food Scanner:** Leverages `expo-image-picker`. Open the device camera or gallery, "scan" a nutrient plate, and receive mock-processed macronutrients corresponding to the item. 

### 3. Advanced Progress Hub
*   **Unified Modal System:** Manage all physiological logs within one comprehensive `ProgressModal`.
*   **Metrics:** Log granular body measurements such as body weight, chest, waist, and arms.
*   **Before/After Photos:** Take direct progress photos saving locally.
*   **Strength Analytics:** View 1-Rep Max estimation trackers based on your 6-month historical lifts.

### 4. Structure & Styling
*   **Theming Engine:** All primary styling routes through `constants/Colors.ts` implementing a dynamic dark-mode compliant neon theme structure applied deeply to inputs, typography, shadows, and visualization SVGs.
*   **App Router:** Native file-based navigation orchestrating tabs seamlessly across the entire ecosystem.

---

## 🛠 Tech Stack

*   **Runtime:** Node.js, `npm run web` (or Android/iOS execution)
*   **Framework:** Expo, React Native, Typescript
*   **Navigation:** Expo Router (`expo-router`)
*   **Icons:** Lucide React Native (`lucide-react-native`)
*   **Charts:** React Native Chart Kit (`react-native-chart-kit`)
*   **Media:** YouTube Iframe (`react-native-youtube-iframe`), Expo Image Picker (`expo-image-picker`)

## 📂 Project Structure
```text
/app
  ├── (tabs)               # Root tab definitions (index, exercise, progress, nutrition, profile)
  ├── _layout.tsx          # Root tab wrapper configuration
  └── program/[id].tsx     # Dynamic route for specific gym programs
/components                # Reusable UI fragments (Modals, Rows, Nav Cards, Layouts, Widgets)
/constants
  ├── Colors.ts            # Palette dictionary
  └── Data.ts              # Pseudo-database containing program objects and exercise maps
/assets                    # Image resources and Splash screens
```

## 🚀 Running Locally

1. Ensure you have Node.js and NPM installed.
2. Clone repository & install: `npm install`
3. Launch development server:
   - For web view (recommended): `npm run web`
   - For Expo GO connection: `npm start`
4. When testing on web, ensure you're simulating a mobile environment using your browser's dev tools (F12) for accurate UI/UX rendering!
