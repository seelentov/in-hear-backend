import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import CONFIG from './config/config.js'
import PATH from './config/path.config.js'

import * as ArtistController from './controllers/ArtistController.js'
import * as LibController from './controllers/LibController.js'
import * as PlaylistController from './controllers/PlaylistController.js'
import * as TrackController from './controllers/TrackController.js'
import * as UserController from './controllers/UserController.js'

import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import storageQuery from './utils/storageQuery.js'
import {
  editValidation,
  loginValidation,
  registerValidation,
} from './validations/user.validation.js'

import {
  editTrackValidation,
  trackValidation,
} from './validations/track.validation.js'

import { createArtistValidation } from './validations/artist.validation.js'
import { createPlaylistValidation } from './validations/playlist.validation.js'

mongoose
	.connect(CONFIG.mongooseConnectionString)
	.then(() => {
		console.log('MongoDB OK')
	})
	.catch(err => {
		console.log(`MongoDB ERR: ${err}`)
	})

const app = express()

app.use(cors())
app.post(PATH.UPLOAD, ...storageQuery)

app.use(express.json())
app.use('/uploads', express.static('uploads'))

//USER
app.post(
	PATH.SIGNUP,
	registerValidation,
	handleValidationErrors,

	UserController.register
)
app.post(
	PATH.LOGIN,
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.get(PATH.ME, checkAuth, UserController.getMe)
app.patch(
	PATH.ME,
	checkAuth,
	editValidation,
	handleValidationErrors,
	UserController.update
)

//LIB
app.get(PATH.LIB, checkAuth, LibController.getMyLib)
app.patch(PATH.LIB, checkAuth, LibController.update)

//TRACKS
app.get(PATH.TRACK, TrackController.getAll)
app.get(PATH.TRACK + '/:id', TrackController.getOne)
app.post(
	PATH.TRACK,
	checkAuth,
	trackValidation,
	handleValidationErrors,
	TrackController.create
)
app.delete(PATH.TRACK + '/:id', checkAuth, TrackController.remove)
app.patch(
	PATH.TRACK + '/:id',
	checkAuth,
	editTrackValidation,
	TrackController.update
)

//PLAYLISTS
app.get(PATH.PLAYLIST, PlaylistController.getAll)
app.get(PATH.PLAYLIST + '/:id', PlaylistController.getOne)
app.post(
	PATH.PLAYLIST,
	checkAuth,
	createPlaylistValidation,
	handleValidationErrors,
	PlaylistController.create
)
app.delete(PATH.PLAYLIST + '/:id', checkAuth, PlaylistController.remove)
app.patch(
	PATH.PLAYLIST + '/:id',
	checkAuth,
	createPlaylistValidation,
	PlaylistController.update
)

//ARTISTS
app.get(PATH.ARTISTS, ArtistController.getAll)
app.get(PATH.ARTISTS + '/:id', ArtistController.getOne)
app.post(
	PATH.ARTISTS,
	checkAuth,
	createArtistValidation,
	handleValidationErrors,
	ArtistController.create
)
app.delete(PATH.ARTISTS + '/:id', checkAuth, ArtistController.remove)
app.patch(
	PATH.ARTISTS + '/:id',
	checkAuth,
	createArtistValidation,
	handleValidationErrors,
	ArtistController.update
)

app.listen(CONFIG.port, err => {
	if (err) {
		return console.log(`Server ERR: ${err}`)
	}
	return console.log('Server OK')
})
