import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_DIR = path.join(__dirname, '..', 'logs');
const MAX_LOG_AGE_DAYS = 30;
const MAX_LOG_SIZE_MB = 100;
const ALERT_THRESHOLD_MB = 80; // Alert when log directory reaches 80% of max size
const AUDIT_FILE_PATTERN = /^\.\w+-audit\.json$/;

// Convert bytes to MB
const bytesToMB = (bytes) => bytes / (1024 * 1024);

// Get directory size in MB
const getDirectorySize = (dirPath) => {
    let size = 0;
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        // Skip audit files in size calculation
        if (AUDIT_FILE_PATTERN.test(file)) return;
        
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
            size += stats.size;
        }
    });
    
    return bytesToMB(size);
};

// Delete old log files
const deleteOldLogs = () => {
    const files = fs.readdirSync(LOGS_DIR);
    const now = new Date();
    
    files.forEach(file => {
        // Skip audit files in deletion
        if (AUDIT_FILE_PATTERN.test(file)) return;
        
        const filePath = path.join(LOGS_DIR, file);
        const stats = fs.statSync(filePath);
        const fileAge = (now - stats.mtime) / (1000 * 60 * 60 * 24); // Age in days
        
        if (fileAge > MAX_LOG_AGE_DAYS) {
            try {
                fs.unlinkSync(filePath);
                logger.info(`Deleted old log file: ${file}`, { age: Math.round(fileAge), days: 'days' });
            } catch (error) {
                logger.error(`Failed to delete old log file: ${file}`, { error: error.message });
            }
        }
    });
};

// Check log file sizes
const checkLogSizes = () => {
    const files = fs.readdirSync(LOGS_DIR);
    
    files.forEach(file => {
        // Skip audit files in size check
        if (AUDIT_FILE_PATTERN.test(file)) return;
        
        const filePath = path.join(LOGS_DIR, file);
        const stats = fs.statSync(filePath);
        const sizeMB = bytesToMB(stats.size);
        
        if (sizeMB > MAX_LOG_SIZE_MB) {
            logger.warn(`Log file size exceeds limit: ${file}`, { 
                size: Math.round(sizeMB),
                maxSize: MAX_LOG_SIZE_MB,
                unit: 'MB'
            });
        }
    });
};

// Monitor log directory size
const monitorLogDirectory = () => {
    const totalSize = getDirectorySize(LOGS_DIR);
    
    if (totalSize > ALERT_THRESHOLD_MB) {
        logger.warn('Log directory size approaching limit', {
            currentSize: Math.round(totalSize),
            threshold: ALERT_THRESHOLD_MB,
            maxSize: MAX_LOG_SIZE_MB,
            unit: 'MB'
        });
    }
    
    return totalSize;
};

// Main monitoring function
const monitorLogs = () => {
    try {
        // Check if logs directory exists
        if (!fs.existsSync(LOGS_DIR)) {
            logger.error('Logs directory not found', { path: LOGS_DIR });
            return;
        }

        // Perform monitoring tasks
        const totalSize = monitorLogDirectory();
        deleteOldLogs();
        checkLogSizes();

        logger.info('Log monitoring completed', {
            totalSize: Math.round(totalSize),
            unit: 'MB'
        });
    } catch (error) {
        logger.error('Error during log monitoring', { error: error.message });
    }
};

// Run monitoring every hour
setInterval(monitorLogs, 60 * 60 * 1000);

// Initial run
monitorLogs();

export default monitorLogs; 