const mongoose = require("mongoose");

// Replace <db_password> with your actual password
const uri = process.env.MONGODB_URI;
async function run() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if the connection is successful
    console.log("Connected to MongoDB!");

    // Ping the MongoDB deployment
    const result = await mongoose.connection.db.admin().ping();
    console.log("Pinged your deployment:", result);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    console.log("Disconnected from MongoDB.");
  }
}

run().catch(console.dir);

module.exports;
