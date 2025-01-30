require('dotenv').config(); // to load .env variables
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Create Express app
const app = express();
app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const localhostRegex = /^http:\/\/localhost:\d+$/;

    const vercelDomainRegex = new RegExp(`^https://${process.env.VERCEL_URL}$`);

    if (localhostRegex.test(origin) || vercelDomainRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));


// Mongo Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Item Schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


// Models
const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);

// Sign Up
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    const trimmedPassword = password.trim();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken.' });
    }

    const hashedPassword = bcrypt.hashSync(trimmedPassword, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log(`Signup success for email: ${email}`);
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedPassword = password.trim();

    console.log(`Received login request for ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = bcrypt.compareSync(trimmedPassword, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful');
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find({}).sort({ updatedAt: -1 });
    const transformed = items.map(item => ({
      id: item._id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      owner: item.owner 
    }));
    res.json(transformed);
  } catch (error) {
    console.error('GET /items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Item
app.post('/items', async (req, res) => {
  try {
    const { name, createdAt, updatedAt, owner } = req.body;

    // Validate we got an owner ID
    if (!owner) {
      return res.status(400).json({ message: 'Owner (userId) is required to create an item.' });
    }

    const newItem = new Item({
      name,
      owner,  
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date()
    });

    await newItem.save();

    res.status(201).json({
      id: newItem._id,
      name: newItem.name,
      createdAt: newItem.createdAt,
      updatedAt: newItem.updatedAt,
      owner: newItem.owner
    });
  } catch (error) {
    console.error('POST /items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Item
app.put('/items/:id', async (req, res) => {
  console.log('PUT /items/:id ->', req.params.id);
  try {
    const { name, createdAt, updatedAt, owner } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) {
      console.log('No item found with that ID');
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== owner) {
      console.log('User is not the owner of this item');
      return res.status(403).json({ message: 'Forbidden: You do not own this item' });
    }

    item.name = name;
    item.createdAt = new Date(createdAt);
    item.updatedAt = new Date(updatedAt);

    await item.save();

    console.log('Successfully updated:', item._id);
    res.json({
      id: item._id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      owner: item.owner
    });
  } catch (error) {
    console.error('PUT /items/:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete Item
app.delete('/items/:id', async (req, res) => {
  console.log("DELETE /items/:id ->", req.params.id);

  const userId = req.query.userId; 
  try {
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      console.log('No item found with that ID');
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== userId) {
      console.log('User is not the owner of this item');
      return res.status(403).json({ message: 'Forbidden: You do not own this item' });
    }
    await item.remove();
    console.log('Deleted item:', item._id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('DELETE /items/:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//For vercel live
module.exports = app;