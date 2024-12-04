import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';
const userSchema = new mongoose.Schema(
  {
    user_id: {type: Number,unique: true,},
    username: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: true,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
    
	},
  { 
    collection: "Users", 
    timestamps: true, 
    versionKey: false // Disable version key (_v)
  }
);
userSchema.plugin(AutoIncrement(mongoose), { inc_field: 'user_id' });
const User = mongoose.model("User", userSchema);

// Export it as default
export default User;


