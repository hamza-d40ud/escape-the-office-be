const generateDocumentFilename = (req, ext, type, identifier=null) => {
    return `${type}_${identifier || req.user.id}${ext}`;
};

export default {
    generateDocumentFilename
}; 