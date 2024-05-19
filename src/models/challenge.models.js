import mongoose from 'mongoose'

const ChallengeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    images: [{
        type: String,
    }],
    category: {
        type: String,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    participants: [{
        type: String,
    }]
});

const Challenge = mongoose.model('Challenge', ChallengeSchema);

export default Challenge;