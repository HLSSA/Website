// init_about.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hlssa.db'); // Replace with actual filename

db.run(
  `INSERT INTO about (company_name, location, est_year, email, contact) VALUES (?, ?, ?, ?, ?)`,
  ['Hyderabad Little Stars Soccer Academy ', 'Cyclone Sports, Toli-Chowki, Hyderabad, Telangana, India-500008', 2015, 'hyderabadlittlestars@gmail.com', '+91 7416675386'],
  function (err) {
    if (err) {
      return console.error("Insert failed:", err.message);
    }
    console.log(`Inserted into about with ID ${this.lastID}`);
    db.close();
  }
);
