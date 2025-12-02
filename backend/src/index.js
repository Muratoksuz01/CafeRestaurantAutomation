const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const apiRoutes = require('./routes');
const { connectToDatabase } = require('./config/db');
const fileUpload = require('express-fileupload');



const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectToDatabase();

        const app = express();
        app.use(fileUpload());
        app.use(express.static('public'));

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });
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

