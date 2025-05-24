import React from 'react';

function QRCodeDisplay({ qrCodeDataUrl, pdfUrl, handlePrintQrCode, uploadedFileTag }) {
  if (!qrCodeDataUrl) {
    return null;
  }

  return (
    <div id="printable-area">
      <div className="qr-code-section">
        <h3>QR Code:</h3>
        <img src={qrCodeDataUrl} alt="QR Code for PDF" />
      </div>
      <div className="pdf-link-section">
        <h3>PDF Link:</h3>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          {pdfUrl}
        </a>
      </div>
      {uploadedFileTag && (
        <div className="tag-section" style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #eee' }}> {/* Added some more distinct styling */}
          <h4 style={{ margin: '0 0 5px 0' }}>Tag:</h4> {/* Basic styling for h4 */}
          <p style={{ margin: '0', fontStyle: 'italic' }}>{uploadedFileTag}</p> {/* Basic styling for p */}
        </div>
      )}
      <button id="print-qr-button" className="print-button" onClick={handlePrintQrCode} style={{ marginTop: '20px' }}>
        Print QR Code & Link
      </button>
    </div>
  );
}

export default QRCodeDisplay;
