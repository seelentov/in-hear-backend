import { body } from 'express-validator'

export const createArtistValidation = [
  body('name').isLength({min: 1}).withMessage('Введите название исполнителя'),
]