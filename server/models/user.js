import bcrypt from 'bcryptjs';
import mongoose, { Schema }  from 'mongoose';

const userSchema = new Schema({
    username: {type: String, required: true},
    role: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    tasks: [{type: Schema.Types.ObjectId, ref: "Task"}],
    bills: [{type: Schema.Types.ObjectId, ref: "Bill"}],
    familyId: {type: Schema.Types.ObjectId, ref: "Family"} // FamilyId to identify the family group
}, 
    {timestamps: true}

);

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Check if the model already exists before defining it to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;