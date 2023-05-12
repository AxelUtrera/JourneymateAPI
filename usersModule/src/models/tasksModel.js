const mongoose = require('mongoose');


const TaskSchema = {
    id : mongoose.Schema.Types.ObjectId,
    name: string,
    task_description: string,
    address: string,
    budget: double,
    schedule: String
};



module.exports = mongoose.Model('tasks', TaskSchema);

