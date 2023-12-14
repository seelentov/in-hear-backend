import crypto from 'crypto'
import multer from 'multer'
import CONFIG from '../config/config.js'
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (_, file, cb) => {
		const randomName = crypto.randomBytes(12).toString('hex')
		const fileExtension = file.originalname.split('.').pop()
		const newFileName = `${randomName}.${fileExtension}`
		cb(null, newFileName)
	},
})

const upload = multer({
	storage,
})

const storageQuery = [
	upload.single('file'),
	(req, res) => {
		res.json({
			url: `${CONFIG.domain}/uploads/${req.file.filename}`,
		})
	},
]

export default storageQuery