import { body } from 'express-validator'
import TrackModel from '../models/Track.js'

export const trackValidation = [
  body('name').isLength({min: 1}).withMessage('Введите название песни'),
  body('artist').isLength({min: 1}).withMessage('Введите исполнителя'),
  body('src').isLength({min: 1}).withMessage('Некорректная ссылка на трек').custom(async value => {
    const track = await TrackModel.findOne({ src: value })
    if (track) {
      throw new Error('Измените название файла песни')
    }
  }),
  body('imageUrl').optional().isURL().withMessage('Некорректная ссылка на изображение'),
]


export const editTrackValidation = [
  body('name').isLength({min: 1}).withMessage('Введите название песни'),
  body('artist').isLength({min: 1}).withMessage('Введите исполнителя'),
  body('imageUrl').optional().isURL().withMessage('Некорректная ссылка на изображение'),
]
