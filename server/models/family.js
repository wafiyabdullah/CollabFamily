import mongoose, {Schema} from "mongoose";

const familySchema = new Schema({ 
    familyId: {type: Schema.Types.ObjectId, required: true, unique: true},
    familyMembers: [{type: Schema.Types.ObjectId, ref: "User"}],
},
    {timestamps: true}
);

const Family = mongoose.model("Family", familySchema);

export default Family;