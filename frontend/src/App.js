import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import axios from 'axios';
import './FileDisplay.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}`).then((res) => setFiles(res.data));

    // Add event listener to handle clicks outside the context menu
    const handleClickOutside = (event) => {
      const menu = document.getElementById('context-menu');
      if (menu && !menu.contains(event.target)) {
        menu.style.display = 'none';
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleFileClick = (filename) => {
    axios.get(`${process.env.REACT_APP_API_URL}/${filename}`).then((res) => setFileContent(res.data));
  };

  const handleFolderDoubleClick = (foldername) => {
    axios.get(`${process.env.REACT_APP_API_URL}/folder/${foldername}`).then((res) => {
      setFiles(res.data);
    });
  };

  const handleContextMenu = (e, filename) => {
    e.preventDefault();
    const menu = document.getElementById('context-menu');
    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${e.clientX}px`;
    menu.style.display = 'block';
    menu.dataset.filename = filename;
  };

  const handleDownload = () => {
    const filename = document.getElementById('context-menu').dataset.filename;
    axios.get(`${process.env.REACT_APP_API_URL}/download/${filename}`, { responseType: 'blob' }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
  };

  const handleShowContent = () => {
    const filename = document.getElementById('context-menu').dataset.filename;
    axios.get(`${process.env.REACT_APP_API_URL}/${filename}`).then((res) => {
      alert(res.data);
    });
  };

  const handleAddFile = () => {
    setModalType('file');
    setShowModal(true);
  };

  const handleAddFolder = () => {
    setModalType('folder');
    setShowModal(true);
  };

  return (
    <div className="container" onContextMenu={(e) => handleContextMenu(e, '')}>
      <h1>IkDrive</h1>
      <FileUpload setFiles={setFiles} files={files} showModal={showModal} setShowModal={setShowModal} modalType={modalType} />
      <h3>Uploaded Files and Folders</h3>
      <div className="file-container">
        {files.map((file) => (
          <div
            key={file}
            className="file-item"
            onClick={() => handleFileClick(file)}
            onDoubleClick={() => handleFolderDoubleClick(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
          >
            <img src={file.includes('.') ? "/files.png" : "/folders.png"} alt="file icon" />
            <span>{file}</span>
          </div>
        ))}
      </div>
      {fileContent && (
        <div>
          <h3>File Content</h3>
          <pre>{fileContent}</pre>
        </div>
      )}
      <div id="context-menu" className="context-menu">
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleAddFile}>Add File</button>
        <button onClick={handleAddFolder}>Add Folder</button>
        <button onClick={handleShowContent}>Show Content</button>
      </div>
    </div>
  );
};

export default App;