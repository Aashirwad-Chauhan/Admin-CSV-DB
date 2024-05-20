import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    customProperties: {
        type: Map,
        of: String
    },
    unsubscribed: {
        type: Boolean,
        default: false
    }
});

export const User = mongoose.model('User', UserSchema);