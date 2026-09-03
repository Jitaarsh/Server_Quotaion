import multer from "multer";
import path from "path";

const isProductImage = (fieldname) =>
  fieldname === "productImage" || /^productImage_\d+$/.test(fieldname);

// File filter
const fileFilter = (req, file, cb) => {
    if (isProductImage(file.fieldname)) {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only images (JPEG, JPG, PNG, WEBP) are allowed for products'));
    } else if (file.fieldname === 'cataloguePdf' || /^cataloguePdf_\d+$/.test(file.fieldname)) {
        const extname = path.extname(file.originalname).toLowerCase() === '.pdf';
        const mimetype = file.mimetype === 'application/pdf';
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only PDF files are allowed for catalogues'));
    } else {
        cb(null, true);
    }
};

const productUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: fileFilter
});

export default productUpload;
