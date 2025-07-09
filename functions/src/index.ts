import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

export const scheduledReminder = functions.pubsub
  .schedule("every day 09:00")
  .onRun(async (context) => {
    const usersSnap = await db
      .collection("users")
      .where("remindersEnabled", "==", true)
      .get();

    const tokens: string[] = [];
    usersSnap.forEach((userDoc) => {
      const data = userDoc.data();
      if (data.fcmToken) {
        tokens.push(data.fcmToken);
      }
    });

    if (tokens.length > 0) {
      const payload = {
        notification: {
          title: "Just Be",
          body: "Time for your daily moment of calm.",
          icon: "/pwa-192x192.png",
        },
      };

      try {
        await messaging.sendToDevice(tokens, payload);
        console.log("Notifications sent successfully");
      } catch (error) {
        console.error("Error sending notifications:", error);
      }
    }

    return null;
  });
