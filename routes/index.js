const express = require("express");
const router = express.Router();
const { getDb } = require("../db/connection"); // Import getDb from the instructor’s pattern

// Web page routes
router.get("/", async (req, res) => {
  try {
    // Use getDb() to access the cached DB instance
    const db = getDb();
    const collection = db.collection("users");  // Example collection name: 'users'
    const data = await collection.find().toArray();

    res.json({
      message: "Welcome to Leon's database!",
      data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Error fetching data",
    });
  }
});

module.exports = router;
