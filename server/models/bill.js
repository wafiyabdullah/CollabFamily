import mongoose, { Schema } from "mongoose";
import Notification from "./notification.js";

const billSchema = new Schema({
    title: {type: String, required: true},
    amount: {type: Number, required: true},
    datelines: {type: Date, required: true},
    priority: {
        type: String,
        default: "Low",
        enum: ["Low", "Medium", "High"],
    },
    status: {
        type: String,
        default: "Unpaid",
        enum: ["Unpaid", "Paid"],
    },
    category: {
        type: String, 
        required: true
    },
    created_by: {type: Schema.Types.ObjectId, ref: "User", required: true},
    mentioned_user: [{type: Schema.Types.ObjectId, ref: "User"}],
    familyId: {type: Schema.Types.ObjectId, ref: "Family", required: true}

},
    {timestamps: true}

);

billSchema.pre('remove', async function(next) {
    await Notification.deleteMany({ type: 'Bill', typeId: this._id });
    next();
});

const Bill = mongoose.model("Bill", billSchema);

export default Bill;