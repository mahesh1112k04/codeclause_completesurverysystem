// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Set up Express application
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/survey_system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('MongoDB connection error:', error));

// Set up body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define survey model using Mongoose
const surveySchema = new mongoose.Schema({
  title: String,
  questions: [{ question: String, options: [String] }]
});

const Survey = mongoose.model('Survey', surveySchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Survey System!');
});

// Create a new survey
app.post('/surveys', async (req, res) => {
  try {
    const { title, questions } = req.body;
    const survey = new Survey({ title, questions });
    await survey.save();
    res.status(201).json({ message: 'Survey created successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating survey.' });
  }
});

// Get all surveys
app.get('/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving surveys.' });
  }
});

// Get a specific survey
app.get('/surveys/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving survey.' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
