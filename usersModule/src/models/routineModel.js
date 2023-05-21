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
                user: {
                    type: String,
                    ref: "user"
                },
                valoration: Number
            }
        ],
        tasks: [
            {
                task: {
                    type: String,
                    ref: "task"
                }
            }
        ],
        routine_comments: [
            {
                comment_creator: {
                    type: String,
                    ref: "user"
                },
                date_creation: Date,
                comment_description: String
            }
        ]
    }
);

module.exports = routine.model('routine', routineSchema);