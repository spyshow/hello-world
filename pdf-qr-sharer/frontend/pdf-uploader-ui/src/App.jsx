import { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage(''); // Clear error message when new file is selected
    setQrCodeDataUrl(''); // Clear previous QR code
    setPdfUrl(''); // Clear previous PDF URL
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a PDF file to upload.');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    setQrCodeDataUrl('');
    setPdfUrl('');

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setPdfUrl(data.pdfUrl);
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'File upload failed. Please try again.');
        setQrCodeDataUrl('');
        setPdfUrl('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('An error occurred during upload. Check the console and backend server.');
      setQrCodeDataUrl('');
      setPdfUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handlePrintQrCode = () => {
    window.print();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF QR Sharer</h1>
      </header>
      <main>
        <div className="upload-section">
          <input type="file" accept=".pdf" onChange={handleFileChange} disabled={uploading} />
          <button onClick={handleUpload} disabled={uploading || !selectedFile}>
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </div>

        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Printable Area */}
        <div id="printable-area">
          {qrCodeDataUrl && (
            <div className="qr-code-section">
              <h2>Scan QR Code to Access PDF</h2>
              <img src={qrCodeDataUrl} alt="QR Code for PDF" />
              {/* Print button moved outside printable-area logically, but associated here */}
            </div>
          )}

          {pdfUrl && (
            <div className="pdf-link-section">
              <h2>Or Use This Link</h2>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                {pdfUrl}
              </a>
            </div>
          )}
        </div>
        
        {/* Print Button - Placed after printable-area so it's not part of it, but logically related */}
        {qrCodeDataUrl && (
            <button id="print-qr-button" className="print-button" onClick={handlePrintQrCode}>
                Print QR Code & Link
            </button>
        )}

      </main>
    </div>
  );
}

export default App;
