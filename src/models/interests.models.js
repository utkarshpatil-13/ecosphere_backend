import mongoose from 'mongoose'

const interestSchema = mongoose.Schema({
    interest: {
        type: String,
    },
    image: {
        type: String
    } 
});

const Interest = mongoose.model('Interest', interestSchema)

export default Interest;