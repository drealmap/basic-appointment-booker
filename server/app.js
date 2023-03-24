const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Appointment",
  password: "haymap28",
  port: 5432,
});

const app = express();
const PORT = process.env.PORT || 3000;

pool.connect();

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post(
  "/book-appointment",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("date").isDate(),
    body("time").notEmpty(),
  ],
  async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, date, time } = req.body;

    try {
      await pool.query(
        "INSERT INTO appointments (name, email, date, time) VALUES ($1, $2, $3, $4)",
        [name, email, date, time]
      );

      res.status(200).json({ message: "Appointment booked successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);




