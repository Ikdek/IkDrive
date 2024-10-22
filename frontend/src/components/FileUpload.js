import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ setFiles, files, showModal, setShowModal, modalType }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setSelectedFiles(e.dataTransfer.files);
  };

  const handleUpload = () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i], selectedFiles[i].webkitRelativePath || selectedFiles[i].name);
    }

    axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData).then((res) => {
      alert('Files uploaded successfully!');
      setFiles([...files, ...res.data.files]);
      setShowModal(false);
    });
  };

  return (
    <div className="upload-container" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <input type="file" webkitdirectory="true" directory="true" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Files and Folders</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{modalType === 'file' ? 'Add File' : 'Add Folder'}</h2>
            <input type="file" webkitdirectory={modalType === 'folder'} directory={modalType === 'folder'} multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;