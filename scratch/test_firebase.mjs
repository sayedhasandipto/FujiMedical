const DB_URL = "https://fujimedicalhall-db-default-rtdb.asia-southeast1.firebasedatabase.app";

async function testConnection() {
  console.log(`Connecting to Firebase Realtime Database at: ${DB_URL}`);
  try {
    const res = await fetch(`${DB_URL}/.json?shallow=true`);
    if (res.ok) {
      const data = await res.json();
      console.log("✅ Successfully connected to Firebase Realtime Database!");
      console.log("Database keys found:", Object.keys(data || {}));
    } else {
      console.error(`❌ Failed: HTTP Status ${res.status}`);
      const text = await res.text();
      console.error("Error response:", text);
    }
  } catch (error) {
    console.error("❌ Network or Connection Error:", error.message);
  }
}

testConnection();
