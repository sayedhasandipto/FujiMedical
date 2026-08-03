import dns from "node:dns";
import { MongoClient } from "mongodb";

// Force Node.js to use Google DNS (bypass stale WARP DNS cache)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = "mongodb+srv://fujimed:sPrRD8QENTPuSMrl@fujimdh.pob9ayu.mongodb.net/fujimedicalhall?retryWrites=true&w=majority";

async function test() {
  console.log("Connecting with Google DNS forced...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected successfully!");
    
    const db = client.db("fujimedicalhall");
    const products = await db.collection("products").find({}).toArray();
    console.log("Products count:", products.length);
    
    if (products.length > 0) {
      console.log("\nFirst product keys:", Object.keys(products[0]));
      const preview = JSON.stringify(products[0], null, 2);
      console.log("First product:", preview.substring(0, 1000));
    }
  } catch (e) {
    console.error("❌ Failed:", e.message);
  } finally {
    await client.close();
  }
}

test();
