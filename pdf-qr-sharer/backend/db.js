const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'uploads-db.json');

const readDB = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const jsonData = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(jsonData);
    }
    return []; // Return empty array if file doesn't exist
  } catch (error) {
    console.error('Error reading from DB:', error);
    return []; // Return empty array on error
  }
};

const writeDB = (data) => {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON
    fs.writeFileSync(dbPath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing to DB:', error);
  }
};

// Initialize DB if it doesn't exist
if (!fs.existsSync(dbPath)) {
  writeDB([]);
}

module.exports = { readDB, writeDB };
