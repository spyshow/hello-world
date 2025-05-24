const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const ip = require('ip');

const app = express();
const PORT = process.env.PORT || 3001;

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
    const pdfUrl = `http://${serverIp}:${PORT}/pdfs/${req.file.originalname}`;
    const qrCodeDataUrl = await qrcode.toDataURL(pdfUrl);

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.originalname,
      pdfUrl: pdfUrl,
      qrCodeDataUrl: qrCodeDataUrl
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
});

// Serve static files from the 'uploads' directory
app.use('/pdfs', express.static(uploadsDir));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://${ip.address()}:${PORT}`);
});
