const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // You need to download this file
const exercises = require("./exercises.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const seedDatabase = async () => {
  console.log("Starting to seed the database...");
  const exercisesCollection = db.collection("exercises");

  for (const exercise of exercises) {
    try {
      await exercisesCollection.doc(exercise.id).set(exercise);
      console.log(`Successfully added exercise: ${exercise.title}`);
    } catch (error) {
      console.error(`Error adding exercise ${exercise.title}:`, error);
    }
  }

  console.log("Database seeding completed.");
};

seedDatabase();
