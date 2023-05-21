const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        lastname: String,
        username: String,
        password: String,
        phone_number: String,
        email: String,
        age: Number,
        city: String,
        country: String,
        user_description: String,
        routines_created: [Object],
        users_followed: [Object],
        followed_routines: [Object]
    }
);

module.exports = mongoose.model('user', userSchema);
