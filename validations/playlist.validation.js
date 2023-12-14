import { body } from 'express-validator'

export const createPlaylistValidation = [
  body('name').isLength({min: 1}).withMessage('Введите название плейлиста'),
]