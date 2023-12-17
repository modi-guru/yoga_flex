const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')



const app = express();
app.use(cors());
const PORT = 5000;
 
// Connect to MongoDB (make sure MongoDB is running)
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/formdata',{family: 4 })


// Create a MongoDB schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  birthDate: Date,
  selectedBatch: String,
  agreeTerms: Boolean,
});
 
// Create a MongoDB model
const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.post('/submitForm', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
