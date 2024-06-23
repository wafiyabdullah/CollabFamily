import mongoose,{ Schema } from "mongoose";
import Notification from "./notification.js";
import User from "./user.js";

const taskSchema = new Schema({ 
    title: {type: String, required: true},
    datelines: {type: Date, required: true},
    priority: {
        type: String,
        default: "Low",
        enum: ["Low", "Medium", "High"],
    },
    status: {
        type: String,
        default: "Incomplete",
        enum: ["Incomplete", "Complete"],
    },
    description: {type: String, required: true},
    created_by: {type: Schema.Types.ObjectId, ref: "User", required: true},
    familyId: {type: Schema.Types.ObjectId, ref: "Family", required: true}, 
},
    {timestamps: true}

);

taskSchema.pre('remove', async function(next) {
    await Notification.deleteMany({ type: 'Task', typeId: this._id });
    next();
});


const Task = mongoose.model("Task", taskSchema);

export default Task;