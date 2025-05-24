import React, { useState } from 'react';
import './App.css';
import FileUploadForm from './components/FileUploadForm';
import QRCodeDisplay from './components/QRCodeDisplay';
import ErrorMessage from './components/ErrorMessage';
import FileList from './components/FileList'; // 1. Import FileList

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFileTag, setUploadedFileTag] = useState('');
  const [uploadCounter, setUploadCounter] = useState(0); // 2. Add uploadCounter state

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage(''); // Clear previous errors
    setQrCodeDataUrl(''); // Also clear QR/PDF info on new file selection
    setPdfUrl('');
    setUploadedFileTag('');
  };

  const handleUpload = async (tag) => { // 2. Modify signature to accept tag
    if (!selectedFile) {
      setErrorMessage('Please select a PDF file first.');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    setQrCodeDataUrl('');
    setPdfUrl('');
    setUploadedFileTag(''); // 5. Clear tag state

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    formData.append('tag', tag); // 3. Append tag to FormData

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload file. Server returned an error.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQrCodeDataUrl(data.qrCodeDataUrl);
      setPdfUrl(data.pdfUrl);
      setUploadedFileTag(data.tag || '');
      setSelectedFile(null); // Clear the file input
      setUploadCounter(prevCount => prevCount + 1); // 3. Increment uploadCounter
      // Clear the actual file input element by resetting its value if possible, or tell user
      // This is tricky as file input is largely uncontrolled for security reasons
      // For now, clearing selectedFile state is the main part.
      if (document.querySelector('input[type="file"]')) {
        document.querySelector('input[type="file"]').value = "";
      }


    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      console.error('Upload error:', error);
      // Ensure all relevant states are cleared on error
      setQrCodeDataUrl('');
      setPdfUrl('');
      setUploadedFileTag(''); // 5. Clear tag state in catch
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
        <h1>PDF QR Code Sharer</h1>
      </header>
      <main>
        <ErrorMessage errorMessage={errorMessage} />
        <FileUploadForm
          onFileChange={handleFileChange}
          handleUpload={handleUpload}
          selectedFile={selectedFile}
          uploading={uploading}
        />
        <QRCodeDisplay
          qrCodeDataUrl={qrCodeDataUrl}
          pdfUrl={pdfUrl}
          handlePrintQrCode={handlePrintQrCode}
          uploadedFileTag={uploadedFileTag}
        />
        <FileList uploadCounter={uploadCounter} /> {/* 4. Render FileList */}
      </main>
    </div>
  );
}

export default App;
