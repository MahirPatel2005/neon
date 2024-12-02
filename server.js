const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5500;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to save form data
app.post('/save', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required.');
  }

  // Prepare the data to save
  const data = { name, email, timestamp: new Date().toISOString() };

  // Path to the file
  const filePath = path.join(__dirname, 'responses.json');

  // Read the existing file (if it exists) and append the new data
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    let responses = [];
    if (!err) {
      try {
        responses = JSON.parse(fileData);
      } catch (e) {
        console.error('Error parsing JSON. Starting with a fresh array.');
      }
    }

    // Add the new response
    responses.push(data);

    // Save the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(responses, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('Failed to save data.');
      }

      res.status(200).send('Data saved successfully.');
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
