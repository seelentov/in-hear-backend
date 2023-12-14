import mongoose from 'mongoose'

const TrackSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		likes: {
			type: Number,
		},
		artist: {
      type: String,
			required: true,
    },
    src: {
      type: String,
			required: true,
      unique: true
    },
    duration: {
      type: Number,
      required: true
    },
    imageUrl: String,
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Track', TrackSchema)
