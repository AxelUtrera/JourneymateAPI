
const { default: mongoose } = require('mongoose');
const users = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        lastname: String,
        username: String,
        password: String,
        phoneNumber: String,
        email: String,
        age: Number,
        city: String,
        country: String,
        userDescription: String,
        routines_created: [Object]
    }
);

module.exports = users.model('user', userSchema);
