const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); // Your existing auth middleware
const Document = require("../models/Document");
const generateSummary = require("../utils/aiSummary");

// GET summary for a document
router.get("/:documentId", protect, async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await Document.findOne({
      _id: documentId,
      uploadedBy: req.user._id // Using req.user._id from your auth middleware
    });
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    if (!document.summary) {
      return res.status(404).json({ message: "No summary found for this document" });
    }
    
    res.json({ summary: document.summary });
  } catch (error) {
    console.error("Get summary error:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

// POST generate summary for a document
router.post("/:documentId", protect, async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // Check if document exists and belongs to user
    const document = await Document.findOne({
      _id: documentId,
      uploadedBy: req.user._id // Using req.user._id from your auth middleware
    });
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // Get document chunks
    const chunks = document.chunks || [];
    
    if (chunks.length === 0) {
      return res.status(400).json({ message: "Document has no content chunks to summarize" });
    }
    
    // Combine chunks into full text
    const fullText = chunks.join("\n\n");
    
    // Generate AI summary
    const summaryContent = await generateSummary(fullText);
    
    // Save summary to document
    document.summary = summaryContent;
    await document.save();
    
    res.json({ summary: document.summary });
  } catch (error) {
    console.error("Generate summary error:", error);
    res.status(500).json({ message: "Failed to generate summary" });
  }
});

module.exports = router;