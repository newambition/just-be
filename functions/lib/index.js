"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDailyReminders = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();
// It's recommended to set this secret in your environment variables
// for production. You can do this by running:
// firebase functions:config:set cron.secret="YOUR_SECRET_KEY"
const CRON_SECRET = ((_a = functions.config().cron) === null || _a === void 0 ? void 0 : _a.secret) || "SUPER_SECRET_KEY";
exports.sendDailyReminders = functions.https.onRequest(async (req, res) => {
    // Check for the secret key in the request header to prevent abuse
    if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
        console.error("Unauthorized access attempt. Incorrect or missing secret.");
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        const usersSnap = await db
            .collection("users")
            .where("remindersEnabled", "==", true)
            .get();
        const tokens = [];
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
            await messaging.sendToDevice(tokens, payload);
            console.log("Notifications sent successfully to", tokens.length, "users.");
            res.status(200).send("Notifications sent successfully.");
        }
        else {
            console.log("No users with reminders enabled.");
            res.status(200).send("No users to notify.");
        }
    }
    catch (error) {
        console.error("Error sending notifications:", error);
        res.status(500).send("Internal Server Error");
    }
});
//# sourceMappingURL=index.js.map