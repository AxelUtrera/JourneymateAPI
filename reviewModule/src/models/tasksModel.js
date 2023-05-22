const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
            description: "task_description is required"
        },

        task_description: {
            type: String,
            required: true,
            description: "task_description is required"
        },

        address: {
            type: String,
            default: ""
        },

        budget: {
            type: Number,
            required: true,
            description: "budget is required"
        },

        isCompleted: {
            type: Boolean,
            default: false,
            description: "Must be a boolean"
        },

        schedule: {
            type: String,
            default: ""
        },

        valorations: {
            type: [
                {
                    user: {
                        type: String,
                        ref: "user",
                        description: "Must be a reference to an existant user"
                    },
                    valoration: {
                        type: Number,
                        min: 1,
                        max: 5,
                        description: "Must be an integer number from 1 to 5"
                    }
                }
            ],
            default: []
        },

        task_comments: {
            type: [
                {
                    comment_creator: {
                        type: String,
                        ref: "user",
                        description: "Must be a reference to an existant user"
                    },
                    date_creation: {
                        type: Date,
                        description: "Must be a future date"
                    },
                    comment_description: {
                        type: String,
                        description: "Must be a string"
                    }
                },
            ],
            default: []
        }
    }
);



module.exports = mongoose.model('task', taskSchema);

