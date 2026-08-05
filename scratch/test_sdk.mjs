import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase config loaded:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function run() {
  console.log("Testing write with SDK...");
  const testRef = push(ref(db, "test_writes"));
  try {
    await set(testRef, {
      message: "Hello from local test script!",
      timestamp: Date.now()
    });
    console.log("✅ SDK Write successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ SDK Write failed:", error.message);
    process.exit(1);
  }
}

run();
