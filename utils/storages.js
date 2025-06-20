import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import files from './files.js';
import models from '../db/models/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createStorage = (generateFilename, subfolder, fileType, identifier=null) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../eto_assets', subfolder));
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = generateFilename(req, ext, fileType, identifier ? identifier(req) : null);
            cb(null, filename);
        }
    });
};

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const maxFileSize = await models.metadata.findByPk('MAX_FILE_SIZE');
const upload_id_picture_storage = multer({
    storage: createStorage(files.generateDocumentFilename, 'id_pictures', 'id'),
    fileFilter: imageFilter,
    limits: {
        fileSize: maxFileSize.value * 1024 * 1024
    }
});



const upload_profile_picture_storage = multer({
    storage: createStorage(files.generateDocumentFilename, 'profile_pictures', 'profile-picture'),
    fileFilter: imageFilter,
    limits: {
        fileSize: maxFileSize.value * 1024 * 1024
    }
});

const upload_university_id_picture_storage = multer({
    storage: createStorage(files.generateDocumentFilename, 'university_id_pictures', 'university-id-picture'),
    fileFilter: imageFilter,
    limits: {
        fileSize: maxFileSize.value * 1024 * 1024   
    }
});

const upload_asset_picture_storage = multer({
    storage: createStorage(files.generateDocumentFilename, 'asset_pictures', 'asset-picture', (req) => req.body.ride_id),
    fileFilter: imageFilter,
    limits: {
        fileSize: maxFileSize.value * 1024 * 1024
    }
});

const upload_certificate_storage = multer({
    storage: createStorage(files.generateDocumentFilename, 'website_certificates', 'website-certificate', (req) => req.params.certificate_id),
    fileFilter: imageFilter,
    limits: {
        fileSize: maxFileSize.value * 1024 * 1024
    }
});

const upload_blog_storage = multer({
    storage: createStorage(files.generateDocumentFilename, 'website_blog_photos', 'website-blog', (req) => req.params.blog_id),
    fileFilter: imageFilter,
    limits: {
        fileSize: maxFileSize.value * 1024 * 1024
    }
});

const upload_payment_method_logo_storage = multer({
    storage: createStorage(files.generateDocumentFilename, 'public_assets', 'payment-method', (req) => req.params.payment_method_id),
    fileFilter: imageFilter,
    limits: {
        fileSize: maxFileSize.value * 1024 * 1024
    }
});

const upload_id_picture = upload_id_picture_storage.single('id_picture');
const upload_profile_picture = upload_profile_picture_storage.single('profile_picture');
const upload_university_id_picture = upload_university_id_picture_storage.single('university_id_picture');
const upload_asset_picture = upload_asset_picture_storage.single('asset_picture');
const upload_certificate_picture = upload_certificate_storage.single('certificate_picture');
const upload_blog_picture = upload_blog_storage.single('blog_picture');
const upload_payment_method_picture = upload_payment_method_logo_storage.single('payment_method_picture');

export default {
    upload_id_picture,
    upload_profile_picture,
    upload_university_id_picture,
    upload_asset_picture,
    upload_certificate_picture,
    upload_blog_picture,
    upload_payment_method_picture
};