import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema({ 
    type: {
        type: String,
        enum: ['Task', 'Bill'],
        required: true
    },
    typeId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    typeTitle: {
        type: String,
        required: true,
    },
    typeDatelines: Date,
    FamilyId: {
        type: Schema.Types.ObjectId,
        ref: "Family",
        required: true,
    },
    FamilyMembers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    FamilyEmails: [{
        type: String,
        required: true,
    }],
    status: {
        type: String,
        enum: ['Waiting', 'Complete', 'Failed', 'Sent'],
        default: 'Waiting',
    },
    sentAt: Date,
    successfulAt: Date,
},
    {
        timestamps: true,
    }
)

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;