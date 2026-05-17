const mongoose = require('mongoose');

// 1. Define the Mongoose Schema (Matches your seed.js exactly)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  imageUrl: String,
});

// 2. Initialize the Model (Forcing it to use the 'products' collection)
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

// 3. Fetch all products from Atlas
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching products", error: error.message });
  }
};

// 4. Fetch a single product by ID from Atlas
const getProductById = async (req, res) => {  
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json({ success: true, data: product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error fetching product", error: error.message });
  }
};

// 5. Add a new product directly to Atlas
const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, imageUrl } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Please provide name, price, and category." });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      category,
      description: description || "No description provided.",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400"
    });

    res.status(201).json({ success: true, message: "Product added to Atlas!", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error adding product", error: error.message });
  }
};

// 6. Handle Contact Form
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log(`\n📬 NEW MESSAGE FROM: ${name} (${email})\nMESSAGE: ${message}\n`);
    res.status(200).json({ success: true, message: "Message received successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
};

module.exports = { getProducts, getProductById, addProduct, submitContact };