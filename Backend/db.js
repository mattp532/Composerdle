
const { Pool } = require('pg');
require('dotenv').config();  

const pool = new Pool({
  user:"postgres",
  password:"Wordpass321*",
  host: "localhost",
  port: 5432,
  database:"Composerdle"
});

module.exports=pool
