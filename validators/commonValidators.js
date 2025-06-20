import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkKey = (body, key) => {
    return body[key] && body[key] !== '' && body[key] !== null && body[key] !== undefined
}
const checkDBExists = async (model, field, value) => {
    let condition = {};
    condition[field] = value;
    
    let exist = await model.findOne({
        where: condition
    });

    return exist !== null;
};

const checkFileExists = (filePath) => {
    try {
        if (filePath.startsWith('/eto_assets')) {
            const PROJECT_ROOT = path.resolve(__dirname, '..');
            return fs.existsSync(path.join(PROJECT_ROOT, filePath));
        }
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
};

const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
        return { isValid: true, value: null };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true, value: email.trim() };
};


const validate_required_keys = (body, requiredKeys) => {
    const missingKeys = requiredKeys.filter(key => !checkKey(body, key));
    if (missingKeys.length > 0) {
        return {
            isValid: false,
            message: `Missing required fields: ${missingKeys.join(', ')}`
        };
    }
    
    return { isValid: true };
};

export default {
    checkKey,
    checkDBExists,
    checkFileExists,
    validateEmail,
    validate_required_keys
}