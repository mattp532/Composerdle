const express = require('express');
const pool = require('./db');  
require('dotenv').config();  
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let randomComposer = null;  

const setRandomComposer = async () => {
  try {
    const result = await pool.query('SELECT * FROM composers;');
    if (result.rows.length > 0) {
      randomComposer = result.rows[Math.floor(Math.random() * result.rows.length)];
      console.log('Random composer of the day set:', randomComposer.name);
    } else {
      console.error('No composers found in the database.');
    }
  } catch (err) {
    console.error('Error selecting random composer:', err);
  }
};

setRandomComposer();

cron.schedule('0 0 0 * * *', async () => {
  console.log('Cron job triggered - setting random composer.');
  await setRandomComposer();
});

// Route to get the random composer of the day
app.get('/composers/daily', (req, res) => {
  if (randomComposer) {
    console.log('Sending random composer of the day:', randomComposer.name);
    res.json(randomComposer);  // Send the random composer if it's set
  } else {
    console.error('Random composer not set yet.');
    res.status(500).json({ error: 'Random composer not set yet. Please try again later.' });
  }
});

app.get('/composers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM composers;');
    res.json(result.rows);  
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error fetching composers' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
