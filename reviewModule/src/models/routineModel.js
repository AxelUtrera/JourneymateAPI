const { default: mongoose} = require('mongoose');
const routine = require('mongoose');

const routineSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        idRoutine: Number,
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
                user: String,
                valoration: Number,
                default: [],
                _id: false
            }
        ],
        tasks: [
            {
                task: Number,
                default: []
            }
        ],
        routine_comments: [
            {
                comment_creator: String,
                date_creation: Date,
                comment_description: String,
                default: []
            }
        ]
    }
);

module.exports = routine.model('routine', routineSchema);