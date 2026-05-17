require('dotenv').config();
const mongoose = require('mongoose');

// Define the Schema (Matches our server.js)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  imageUrl: String,
});

const Product = mongoose.model('Product', productSchema);

// Our initial inventory data
const products = [
  {
    name: "Arduino Uno R3 (Compatible)",
    price: 450,
    category: "Arduino",
    description: "The classic microcontroller board for all your DIY projects.",
    imageUrl: "https://m.media-amazon.com/images/I/51wN+A0nU7L._SX342_SY445_.jpg"
  },
  {
    name: "Arduino Mega 2560 R3",
    price: 1200,
    category: "Arduino",
    description: "For projects that require more complex circuitry and memory.",
    imageUrl: "https://m.media-amazon.com/images/I/71u9sJ-9iGL._SX679_.jpg"
  },
  {
    name: "Raspberry Pi 4 Model B (4GB RAM)",
    price: 4500,
    category: "Raspberry Pi",
    description: "A powerful tiny computer for desktop, media, and IoT applications.",
    imageUrl: "https://m.media-amazon.com/images/I/71w8N4x+KML._SX679_.jpg"
  },
  {
    name: "Raspberry Pi Pico",
    price: 450,
    category: "Raspberry Pi",
    description: "A fast, versatile, and highly affordable microcontroller board.",
    imageUrl: "https://m.media-amazon.com/images/I/510R-1R6z-L._SX679_.jpg"
  },
  {
    name: "HC-SR04 Ultrasonic Sensor",
    price: 90,
    category: "Sensors & Modules",
    description: "Perfect for distance measurement and obstacle avoidance robots.",
    imageUrl: "https://m.media-amazon.com/images/I/51R8pQYtQnL._SX679_.jpg"
  },
  {
    name: "DHT11 Temperature & Humidity Sensor",
    price: 120,
    category: "Sensors & Modules",
    description: "Basic, ultra low-cost digital temperature and humidity sensor.",
    imageUrl: "https://m.media-amazon.com/images/I/51+nE3b5GqL._SX679_.jpg"
  },
  {
    name: "L298N Motor Driver Module",
    price: 180,
    category: "Motors & Drivers",
    description: "Dual H-Bridge motor driver for controlling DC and stepper motors.",
    imageUrl: "https://m.media-amazon.com/images/I/61Nl-HhNpwL._SX679_.jpg"
  },
  {
    name: "NEMA 17 Stepper Motor",
    price: 850,
    category: "Motors & Drivers",
    description: "High precision motor ideal for 3D printers and CNC machines.",
    imageUrl: "https://m.media-amazon.com/images/I/61qS+w3pA1L._SX679_.jpg"
  },
  {
    name: "BLDC Brushless Motor 1000KV",
    price: 650,
    category: "Drone Parts",
    description: "High efficiency brushless motor for quadcopters and RC planes.",
    imageUrl: "https://m.media-amazon.com/images/I/51F0Zk82yAL._SX679_.jpg"
  },
  {
    name: "30A ESC (Electronic Speed Controller)",
    price: 450,
    category: "Drone Parts",
    description: "Essential for controlling the speed of brushless drone motors.",
    imageUrl: "https://m.media-amazon.com/images/I/51m8G+2mKJL._SX679_.jpg"
  }
];

// Run the script
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Clear the old data
    await Product.deleteMany();
    console.log('🧹 Cleared existing products');
    
    // Insert the new data
    await Product.insertMany(products);
    console.log(`📦 Successfully seeded ${products.length} products!`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();