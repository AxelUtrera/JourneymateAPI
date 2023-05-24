const mongoose = require('mongoose');


const routineSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        city: String,
        country: String,
        routine_description: String,
        visibility: String,
        label_category: String,
        state_country: String,
        town: String,
        valorations: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user"
                },
                valoration: Number
            }
        ],
        tasks: [
            {
                task: {
                    type: String,
                    default:[],
                    _id: false
                },
                _id:false
            }
        ],
        routine_comments: [
            {
                comment_creator: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user"
                },
                date_creation: Date,
                comment_description: String
            }
        ]
    }
);

module.exports = mongoose.model('routine', routineSchema);