const mongoose = require('mongoose')
const Schema = mongoose.Schema
const courses = require('./Course')
const ObjectId = Schema.Types.ObjectId

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: false
    },
    lastName: {
        type: String,
        require: false
    },
    description: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
    },
    courses: [{
        type: ObjectId,
        ref: 'courses',
        required: false
    }]
})


const User = mongoose.model('users', userSchema);
module.exports = User;
