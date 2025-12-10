const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require("multer");
const fs = require("fs")
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const apiRoutes = require('./routes');
const { connectToDatabase } = require('./config/db');

const uploadDir = path.join(__dirname, "assets/foods");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
/* 
// Multer ayarı (tek dosya)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = file.fieldname + "-" + Date.now() + ext;
        cb(null, name);
    },
}); */



const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectToDatabase();

        const app = express();
        // app.use(fileUpload());
        app.use(express.static('public'));

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        // const upload = multer({ dest: "assets/foods" });

        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });
       /*  app.post("/single", upload.single("imgs"), (req, res) => {
            console.log("Dosya geldi mi?", req.file);
            res.json({ success: true, file: req.file });
        });
        app.get("/file", (req, res) => {
            const filePath = req.query.path;
            if (!filePath) return res.status(400).send("path gerekli");

            const absolutePath = path.join(process.cwd(), filePath);

            if (!fs.existsSync(absolutePath)) {
                return res.status(404).send("Dosya bulunamadı");
            }

            res.sendFile(absolutePath);
        }); */
        // API routes
        app.use('/api', apiRoutes);

        app.listen(PORT, () => {
            console.log(`API listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err && err.stack ? err.stack : err);
        process.exit(1);
    }
}
startServer();

