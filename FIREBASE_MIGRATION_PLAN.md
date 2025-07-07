# Firebase Migration Plan

This document outlines the plan to migrate the Just Be application from using `localStorage` to a full Firebase backend.

## High-Level Migration Plan

The migration will be broken down into six distinct phases. This approach allows for incremental changes, making testing and debugging more manageable.

1.  **Firebase Project Setup & Configuration:** Laying the groundwork.
2.  **User Authentication:** Introducing user accounts.
3.  **Firestore Database Migration:** Moving data from `localStorage` to a scalable, real-time database.
4.  **Cloud Messaging:** Enabling push notifications for reminders.
5.  **Cloud Functions:** Implementing server-side logic for scheduled notifications.
6.  **Analytics:** Gaining insights into user behavior.

### Target Architecture

```mermaid
graph TD
    subgraph Client (React App)
        A[React Components] --> B{AppContext};
        B --> C{AuthContext};
        C --> D[Firebase Services];
        A --> D;
    end

    subgraph Firebase
        D -- CRUD --> E(Firestore Database);
        D -- Auth --> F(Authentication);
        D -- Events --> G(Analytics);
        D -- Token Mgmt --> H(Cloud Messaging);
    end

    subgraph Serverless
        I(Cloud Functions) -- Trigger --> H;
        I -- Reads --> E;
    end

    F -- UID --> E;
    H -- Sends --> J[User Devices];

    style Client fill:#cde4f9,stroke:#99bde5,stroke-width:2px
    style Firebase fill:#ffcda4,stroke:#f7a460,stroke-width:2px
    style Serverless fill:#d2f5d2,stroke:#a0dca0,stroke-width:2px
```

---

## Phase 1: Firebase Project Setup & Configuration

This initial phase connects your React application to Firebase.

1.  **Create Firebase Project:**

    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click "Add project" and follow the setup instructions.
    - Once created, navigate to Project Settings > General.
    - Under "Your apps", click the web icon (`</>`) to register your web app.
    - Give it a nickname and copy the `firebaseConfig` object.

2.  **Install Firebase SDK:**

    - Add the Firebase library to your project:
      ```bash
      npm install firebase
      ```

3.  **Create Firebase Configuration File:**

    - Create a new file: `src/firebase.ts`
    - This file will initialize Firebase and export the necessary services.

    ```typescript
    // src/firebase.ts
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { getAnalytics } from "firebase/analytics";
    import { getMessaging } from "firebase/messaging";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Export services
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    export const analytics = getAnalytics(app);
    export const messaging = getMessaging(app);
    ```

    - **Security Note:** It's best practice to use environment variables for your Firebase config keys. You can use Vite's `import.meta.env` feature for this.

4.  **Update `main.tsx`:**
    - Ensure Firebase is initialized when the app starts by importing the new file in `src/main.tsx`.
    ```typescript
    // src/main.tsx
    import "./firebase"; // Initialize Firebase
    // ... rest of the file
    ```

---

## Phase 2: User Authentication

This phase introduces user accounts, protecting user data.

1.  **New Files for Authentication:**

    - **`src/context/AuthContext.tsx`**: A new React context to manage authentication state and provide auth-related functions (`signup`, `login`, `logout`).
    - **`src/pages/AuthPage.tsx`**: A new page component with forms for user sign-up and login.
    - **`src/components/ProtectedRoute.tsx`**: A component to guard routes that require an authenticated user.

2.  **Refactoring Plan:**
    - **`App.tsx`**: Wrap the main application routes with the `ProtectedRoute` component. It will redirect unauthenticated users to the `AuthPage`.
    - **`main.tsx`**: Wrap the `<App />` component with the new `AuthProvider`.
    - **`useAppLogic.ts`**: This hook will now consume `AuthContext` to get the current user's ID (`uid`), which will be essential for data fetching in the next phase.

---

## Phase 3: Firestore Database Migration

Here, we'll replace `localStorage` with Firestore for data persistence.

1.  **Data Modeling in Firestore:**

    - **`users` collection**: Each document will be named with the user's `uid` from Firebase Auth. The document will contain `settings` and `history` objects.
    - **`exercises` collection**: The static exercise data from `src/data/exercises.tsx` will be moved into a top-level collection in Firestore. This allows you to update or add exercises without deploying a new version of the app.

2.  **New Files for Data Management:**

    - **`src/services/firestoreService.ts`**: This module will contain all the logic for interacting with Firestore (e.g., `getUserData`, `updateSettings`, `logSession`, `getExercises`).

3.  **Refactoring Plan:**
    - **`AppContext.tsx`**: This will be the most significant change.
      - Remove all calls to `getStoredSettings`, `setStoredSettings`, etc. from `src/utils/storage.ts`.
      - On user login, fetch the user's `settings` and `history` from Firestore using the `firestoreService`.
      - Use Firestore's `onSnapshot` method to listen for real-time updates to user data.
      - Functions like `updateSettings`, `logSession`, and `toggleFavorite` will now call functions in `firestoreService` to update the data in Firestore.
    - **`utils/storage.ts`**: This file can be deleted after the migration.
    - **`pages/HistoryPage.tsx` & `components/SettingsPanel.tsx`**: No major changes are needed here, as they consume the `AppContext`. They will automatically display the data from Firestore once `AppContext` is refactored.
    - **`pages/PresetSelectionPage.tsx`**: This page will now fetch the list of exercises from Firestore instead of importing them from a local file.

---

## Phase 4 & 5: Cloud Messaging & Functions for Reminders

This will bring the "Daily Reminders" feature to life.

1.  **New Files:**

    - **`public/firebase-messaging-sw.js`**: The service worker required for receiving push notifications when the app is in the background.
    - **`src/services/messagingService.ts`**: A module to handle requesting notification permissions, getting the user's FCM token, and saving it to their user document in Firestore.
    - **`functions/src/index.ts`**: A new directory and file for your Cloud Functions code.

2.  **Implementation Plan:**
    - **`SettingsPanel.tsx`**: When a user enables "Daily Reminders", call the `messagingService` to request permission and store the FCM token.
    - **Cloud Function (`functions/src/index.ts`)**:
      - Create a scheduled function that runs once a day.
      - This function will query the `users` collection for all users who have `remindersEnabled: true`.
      - It will then send a push notification to each of those users via their stored FCM token.

---

## Phase 6: Firebase Analytics

Finally, let's add analytics to understand user engagement.

1.  **New Files:**

    - **`src/services/analyticsService.ts`**: A module to wrap Firebase Analytics calls, making it easy to log custom events from anywhere in the app.

2.  **Implementation Plan:**
    - Integrate `analyticsService` calls into key user actions:
      - In `useAppLogic.ts`, log an event when an exercise is completed.
      - In `AppContext.tsx`, log events when settings are changed or an exercise is favorited.
      - Firebase Analytics automatically tracks page views, so you'll get that for free.
