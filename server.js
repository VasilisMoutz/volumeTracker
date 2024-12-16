const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

dotenv.config();
const app = express();
const saltRounds = Number(process.env.SALT_ROUNDS);

app.use(express.static(__dirname + "/public"));


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.post('/api/register', jsonParser, async (req, res) => {

  try {
    const { username, password } = req.body;

    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        res.status(500).json({error: err});
        return;
      }
      console.log(hash);
    });

  } catch (error) {
    res.status(500).json({error: 'Registration failed'});
  }

  res.status(200).json({error: 'Registration complete'});
})

app.get('/*', (req, res) => {
  res.redirect('/');
})

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})