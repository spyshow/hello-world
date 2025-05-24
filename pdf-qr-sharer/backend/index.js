const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const ip = require('ip');
const cors = require('cors'); // Require CORS
const { v4: uuidv4 } = require('uuid'); // Require uuid
const { readDB, writeDB } = require('./db'); // Require DB functions

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors()); // Add CORS middleware

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  }
});

const upload = multer({ storage: storage });

// POST route for file upload
app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const serverIp = ip.address();
    // Ensure req.file.originalname is properly encoded for URL
    const encodedFilename = encodeURIComponent(req.file.originalname);
    const pdfUrl = `http://${serverIp}:${PORT}/pdfs/${encodedFilename}`;
    const userTag = req.body.tag || '';
    const qrCodeDataUrl = await qrcode.toDataURL(pdfUrl);

    // Generate ID and metadata
    const id = uuidv4();
    const metadata = {
      id: id,
      originalFilename: req.file.originalname,
      storedFilename: req.file.originalname, // As per current multer setup
      pdfUrl: pdfUrl,
      qrCodeDataUrl: qrCodeDataUrl,
      tag: userTag,
      uploadTimestamp: new Date().toISOString()
    };

    // Store metadata in DB
    const dbData = readDB();
    dbData.push(metadata);
    writeDB(dbData);

    // Send response (as it was before, with tag included)
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.originalname,
      pdfUrl: pdfUrl,
      qrCodeDataUrl: qrCodeDataUrl,
      tag: userTag
    });
  } catch (error) {
    console.error('Error generating QR code or processing file:', error);
    res.status(500).json({ message: 'Error processing file or generating QR code', error: error.message });
  }
});

// Serve static files from the 'uploads' directory
// Make sure this is also correctly handling potential special characters in filenames if necessary
// express.static by default uses 'send' which handles Content-Disposition and ETag, and should be fine.
app.use('/pdfs', express.static(uploadsDir));

// GET endpoint to retrieve all file metadata
app.get('/files', (req, res) => {
  try {
    const dbData = readDB();
    const { search, tag } = req.query;
    let filteredData = dbData;

    if (search) {
      filteredData = filteredData.filter(file => 
        file.originalFilename && file.originalFilename.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (tag) {
      filteredData = filteredData.filter(file => 
        file.tag && file.tag.toLowerCase().includes(tag.toLowerCase())
      );
    }
    
    res.json(filteredData);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: 'Error retrieving file list from server.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://${ip.address()}:${PORT}`);
  console.log(`Allowing requests from all origins (CORS enabled)`);
});
