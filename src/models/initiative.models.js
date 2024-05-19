import mongoose from 'mongoose'

const InitiativeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    images: [{
        type: String,
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    participants: [{
        type: String
    }]
});

const Initiative = mongoose.model('Initiative', InitiativeSchema);

export default Initiative;