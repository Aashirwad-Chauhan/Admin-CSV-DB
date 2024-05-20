import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    customProperties: [{
        title: { type: String, required: true },
        defaultValue: { type: String, required: true }
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

export const List = mongoose.model('List', ListSchema);