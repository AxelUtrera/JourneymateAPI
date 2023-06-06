const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required : true
        },

        lastname: {
            type: String,
            required : true
        },

        age: {
            type:Number,
            required : true
        },
        
        username: {
            type: String,
            required : true
        },

        password: {
            type: String,
            required : true
        },

        email: {
            type: String,
            required : true
        },

        phone_number: { 
            type: String, 
            default: "" 
        },

        city: { 
            type: String, 
            default: "" 
        },

        country: { 
            type: String, 
            default: "México" 
        },

        user_description: {
            type: String,
            default: function () {
                return `Hi there, I'm ${this.name}`;
            }
        },

        routines_created: {
            type: [
                {
                    routine: {
                        type: String,
                        ref: "routine"
                    },
                    _id: false
                }
            ],
            default: []
        },

        followed_routines: {
            type: [
            ],
            default: []
        },

        users_followed : {
            type: [
                {
                    type: String,
                    ref : "user"
                }
            ],
            default : []
        }
    }
);

module.exports = mongoose.model('user', userSchema);
