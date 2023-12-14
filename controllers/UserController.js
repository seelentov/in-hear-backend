import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import CONFIG from '../config/config.js'
import PATH from '../config/path.config.js'
import LibModel from '../models/Lib.js'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const avatarUrl = req.body.avatarUrl || PATH.DEFAULT_IMG.USER

		const doc = new UserModel({
			email: req.body.email,
			login: req.body.login,
			passwordHash: hash,
			avatarUrl,
			role: 'user',
		})

		const user = await doc.save()

		const lib = new LibModel({
			userId: user._id,
		})

    lib.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			CONFIG.secretJWT,
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({
			email: req.body.email,
		})

		if (!user) {
			return res.status(400).json({
				message: 'Wrong login or password',
			})
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Wrong login or password',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			CONFIG.secretJWT,
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Неудалось авторизоваться',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.json(userData)
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			message: 'Нет доступа',
		})
	}
}


export const update = async (req, res) => {
	try {
		const user = await UserModel.findByIdAndUpdate(req.userId, {
      avatarUrl: req.body.avatarUrl,
      login: req.body.login,
    }, {
      new: true
    })

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.json(userData)
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			message: 'Нет доступа',
		})
	}
}




