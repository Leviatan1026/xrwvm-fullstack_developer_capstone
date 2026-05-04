const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
 
const app = express();
const port = 3030;
 
app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));
 
// Load JSON data
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));
 
// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' });
 
const Reviews = require('./review');
const Dealerships = require('./dealership');
 
// Insert initial data
async function seedData() {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);
 
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);
 
    console.log("✅ Data seeded correctamente");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}
 
seedData();
 
// Home route
app.get('/', async (req, res) => {
  res.send("Welcome to the Mongoose API");
});
 
// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});
 
// Fetch reviews by dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: parseInt(req.params.id) });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer reviews' });
  }
});
 
// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});
 
// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});
 
// Fetch dealer by id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const document = await Dealerships.findOne({ id: parseInt(req.params.id) });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealership by id' });
  }
});
 
// Insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  let data = JSON.parse(req.body);
 
  const documents = await Reviews.find().sort({ id: -1 });
  let new_id = documents[0]['id'] + 1;
 
  const review = new Reviews({
    "id": new_id,
    "name": data['name'],
    "dealership": data['dealership'],
    "review": data['review'],
    "purchase": data['purchase'],
    "purchase_date": data['purchase_date'],
    "car_make": data['car_make'],
    "car_model": data['car_model'],
    "car_year": data['car_year'],
  });
 
  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});
 
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});