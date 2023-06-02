const { default: mongoose} = require('mongoose');
const routine = require('mongoose');

const routineSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        idRoutine: Number,
        name: String,
        routine_creator: String,
        city: String,
        country: String,
        routine_description: String,
        visibility: String,
        label_category: String,
        state_country: String,
        town: String,
        valorations: {
            type: [
                {
                    user: {
                        type: String
                    },
                    valoration: {
                        type: Number
                    },
                    _id: false
                }
            ],
            default: []
        },
        tasks: {
            type: [
                {
                    task: {
                        type: String,
                        
                    },
                    _id: false
                }
            ],
            default: []
            
        },
        routine_comments: {
            type: [
                {
                    comment_creator: {
                        type: String
                    },
                    date_creation: {
                        type: Date
                    },
                    comment_description: {
                        type: String
                    },
                    _id: false
                }
            ],
            default: []
        }
    }
);

module.exports = routine.model('routine', routineSchema);