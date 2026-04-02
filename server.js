require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log(err));



// Generate Tracking ID
function generateTrackingId() {
  const part1 = Math.floor(10000 + Math.random() * 90000);
  const part2 = Math.floor(10000 + Math.random() * 90000);
  return `GS-${part1}-${part2}`;
}

// Schema
const shipmentSchema = new mongoose.Schema({
  trackingId: { type: String, required: true },
  origin: String,
  destination: String,
  delivery: String,
  cargo: String,
  weight: String,
  value: String,
  status: { type: String, default: "Processing" },
  event: String,
  location: String
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

// CREATE shipment
app.post("/shipments", async (req, res) => {
  try {
    const shipment = new Shipment({
      trackingId: generateTrackingId(),
      origin: req.body.origin || "",
      destination: req.body.destination || "",
      delivery: req.body.delivery || "",
      cargo: req.body.cargo || "",
      weight: req.body.weight || "",
      value: req.body.value || "",
      status: "Processing"
    });

    const savedShipment = await shipment.save();
    console.log("Created shipment:", savedShipment);
    res.json(savedShipment);
  } catch (err) {
    console.error("Error creating shipment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET shipment by trackingId
app.get("/shipments/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingId: req.params.id });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (err) {
    console.error("Error fetching shipment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE shipment by trackingId
app.put("/shipments/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { trackingId: req.params.id },
      req.body,
      { new: true }
    );
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (err) {
    console.error("Error updating shipment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});