const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    id_courses: {
        type: Object,
        required: false
    }
})


const User = mongoose.model('users', userSchema);
module.exports = User;
