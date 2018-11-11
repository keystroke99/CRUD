const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    mobile: {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    contacts: [{ type: Schema.Types.ObjectId, ref: 'Contact' }]
});

module.exports = User = mongoose.model('User', UserSchema);