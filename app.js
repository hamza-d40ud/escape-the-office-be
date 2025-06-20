import express from 'express';
import basicAuth from 'express-basic-auth';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https'; // <-- Use HTTPS instead of HTTP
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './docs/swagger/index.js';
import fs from 'fs';
import './db/models/index.js';
import cors from 'cors'
import leaderboardRoute from './routes/leaderboardRoute.js'
import catchAsync from './utils/catchAsync.js';
import AppError from './utils/appError.js';
import errorController from './controllers/errorController.js';
import middlewares from './middlewares.js';
import './jobs/index.js'
import logger from './utils/logger.js';
import './scripts/logMonitor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create eto_assets directories
const asset_dirs = ['public_assets'];
const eto_assets_dir = path.join(__dirname, 'eto_assets');
if (!fs.existsSync(eto_assets_dir)) {
    fs.mkdirSync(eto_assets_dir, { recursive: true });
}
for (const dir of asset_dirs) {
    const dir_path = path.join(eto_assets_dir, dir);
    if (!fs.existsSync(dir_path)) {
        fs.mkdirSync(dir_path, { recursive: true });
    }
}
const sslKeyPath = 'server.key';
const sslCertPath = 'server.crt';

// Load SSL credentials
const sslOptions = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath),
};
const app = express();
const server = https.createServer(sslOptions, app);

app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use(middlewares.requestLogger);

// Serve public assets without authentication
app.use('/public_assets', express.static(path.join(__dirname, 'eto_assets/public_assets')));

// all routes will be here
app.use('/api/v1/leaderboard', leaderboardRoute.router);

if (process.env.ENABLE_DOCS === 'true') {
    const docsAuth = basicAuth({
        users: { 'fe-dev': 'P@ssw0rd' },
        challenge: true,
        unauthorizedResponse: (req) => 'Not authorized',
    });
    const postmanCollectionPath = path.join(__dirname, 'docs/Eride.postman_collection.json');
    app.use('/docs/http-doc', docsAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    app.get('/docs/postman', docsAuth, (req, res) => {
        res.setHeader('Content-Disposition', 'attachment; filename=Eride.postman_collection.json');
        res.sendFile(postmanCollectionPath);
    });
}
app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);

app.use(errorController.globalErrorHandler);

const PORT = process.env.APP_PORT || 3000;

server.listen(PORT, () => {
    logger.info('[MAIN-SERVER] ✅  Server (HTTP + Client Socket + Admin) up and running on port', { port: PORT });
});
