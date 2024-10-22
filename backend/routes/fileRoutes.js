const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const uploadDir = path.join(__dirname, '../', process.env.UPLOAD_DIR);

// Configure multer to handle uploaded files and folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(uploadDir, path.dirname(file.originalname));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to upload files and folders
router.post('/upload', upload.array('files'), (req, res) => {
  res.send({ message: 'Files uploaded successfully', files: req.files.map(file => file.originalname) });
});

// Route to list files and folders
router.get('/', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).send('Unable to scan directory');
    res.send(files);
  });
});

// Route to list files within a folder
router.get('/folder/:foldername', (req, res) => {
  const folderPath = path.join(uploadDir, req.params.foldername);
  fs.readdir(folderPath, (err, files) => {
    if (err) return res.status(500).send('Unable to scan directory');
    res.send(files);
  });
});

// Route to read a text file
router.get('/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

// Route to download a file or folder
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  res.download(filePath);
});

module.exports = router;