var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM merchant');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.listen(PORT, () => {
 console.log("Server running on port ${ PORT }");
});