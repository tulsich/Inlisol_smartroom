const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================== CONFIG ==================


const MQTT_HOST = "mqtt://49.233.62.48:1883";
const COMPANY_ID = "27195817";
const DEVICE_ID = "A3"; // ⚠️ verify this carefully
const MQTT_USERNAME = COMPANY_ID;
const MQTT_PASSWORD = "BJQcFrtyGbPTwktT";

const EVENT_TOPIC = `/${COMPANY_ID}/+/event`;


console.log("🔎 MQTT CONFIG");
console.log("Host:", MQTT_HOST);
console.log("Topic:", EVENT_TOPIC);

const client = mqtt.connect(MQTT_HOST, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  keepalive: 60,
  reconnectPeriod: 3000,
});

client.on("connect", () => {
  console.log("✅ MQTT CONNECTED");

  client.subscribe(EVENT_TOPIC, (err) => {
    if (err) {
      console.error("❌ SUBSCRIBE FAILED:", err.message);
    } else {
      console.log("📡 SUBSCRIBED TO:", EVENT_TOPIC);
    }
  });
});

client.on("message", (topic, payload) => {
  console.log("📨 MQTT MESSAGE:", topic);
  console.log(payload.toString().slice(0, 200)); // preview
});

client.on("error", (err) => {
  console.error("❌ MQTT ERROR:", err.message);
});

client.on("reconnect", () => {
  console.log("🔁 MQTT reconnecting...");
});

client.on("offline", () => {
  console.log("⚠️ MQTT offline");
});

// ================== API ==================
app.get("/", (req, res) => {
  res.send("INLISOL backend is running");
});

app.get("/api/latest", (req, res) => {
  res.json(telemetry);
});

// ================== SERVER ==================
app.listen(5050, () => {
  console.log("🚀 Backend running at http://localhost:5050");
});
