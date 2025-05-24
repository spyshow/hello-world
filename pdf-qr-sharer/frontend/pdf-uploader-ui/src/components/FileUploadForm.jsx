import React, { useState } from 'react';

function FileUploadForm({ onFileChange, handleUpload, selectedFile, uploading }) {
  const [tag, setTag] = useState('');

  return (
    <div className="upload-section">
      <h2>Upload PDF</h2>
      <div style={{ marginBottom: '15px' }}> {/* Adjusted margin for better spacing */}
        <label htmlFor="tag-input" style={{ marginRight: '10px', display: 'block', marginBottom: '5px' }}>Tag (Optional):</label>
        <input
          type="text"
          id="tag-input"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Enter a tag (e.g., meeting-notes, invoice)"
          disabled={uploading}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: 'calc(100% - 20px)' }} // Adjusted width
        />
      </div>
      <div style={{ marginBottom: '15px' }}> {/* Adjusted margin for better spacing */}
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          disabled={uploading}
          // Using default browser styling for file input, which is generally fine
        />
      </div>
      <button 
        onClick={() => handleUpload(tag)} // Pass the tag to handleUpload
        disabled={!selectedFile || uploading}
        // style={{ marginTop: '10px' }} // Margin handled by parent div or general button styles in App.css
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default FileUploadForm;
