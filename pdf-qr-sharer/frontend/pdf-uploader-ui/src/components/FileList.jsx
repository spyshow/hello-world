import React, { useState, useEffect } from 'react';

function FileList({ uploadCounter }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // 1. Add searchTerm state
  const [filterTag, setFilterTag] = useState('');   // 1. Add filterTag state

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError('');
      try {
        let url = 'http://localhost:3001/files'; // 2. Construct URL dynamically
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        if (filterTag) {
          params.append('tag', filterTag);
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const response = await fetch(url); // Use dynamic URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFiles(data);
      } catch (e) {
        setError('Failed to load files: ' + e.message);
        console.error('Fetch files error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [uploadCounter, searchTerm, filterTag]); // 2. Add searchTerm and filterTag to dependency array

  if (loading) {
    return <p>Loading files...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (files.length === 0) {
    return <p>No files uploaded yet.</p>;
  }

  return (
    <div className="file-list-section" style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
      <h2>Uploaded Files</h2>
      {/* 3. Add Input Fields for Search and Filter */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flexGrow: 1 }}
        />
        <input
          type="text"
          placeholder="Filter by tag..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flexGrow: 1 }}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Filename</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Tag</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Link</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{file.originalFilename}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{file.tag || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <a href={file.pdfUrl} target="_blank" rel="noopener noreferrer">
                  Open PDF
                </a>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(file.uploadTimestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;
