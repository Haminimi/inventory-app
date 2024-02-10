const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads');
	},
	filename: (req, file, cb) => {
		const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniquePrefix + '-' + file.originalname);
	},
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
