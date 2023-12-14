import { body } from 'express-validator'
import UserModel from '../models/User.js'

export const registerValidation = [
	body('email')
		.isEmail()
		.withMessage('Неверный формат почты')
		.custom(async value => {
			const user = await UserModel.findOne({ email: value })
			if (user) {
				throw new Error("The user's email address already exists")
			}
		}),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be more than 5 characters'),
	body('login').isLength({ min: 3 }).withMessage('Enter the correct login'),
	body('avatarUrl')
		.optional()
]

export const loginValidation = [
	body('email').isEmail().withMessage('Неверный формат почты'),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Пароль должен быть более 5 символов'),
]

export const editValidation = [
	body('avatarUrl').optional().isURL().withMessage('Некорректная ссылка'),
	body('login').isLength({ min: 3 }).withMessage('Введите корректный логин'),
]
