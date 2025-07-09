import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

export const requestNotificationPermission = async (
  userId: string
): Promise<void> => {
  console.log("Requesting notification permission...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");
    try {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          fcmToken: currentToken,
          remindersEnabled: true, // Also update the reminders setting
        });
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  } else {
    console.log("Unable to get permission to notify.");
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
