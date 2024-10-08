import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);