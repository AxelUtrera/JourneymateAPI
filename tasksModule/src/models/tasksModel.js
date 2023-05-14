const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema(
    {
        id : mongoose.Schema.Types.ObjectId,
        name: String,
        task_description: String,
        address: String,
        budget: Number,
        schedule: String
    }
);



module.exports = mongoose.model('tasks', taskSchema);

