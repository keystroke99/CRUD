const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ContactSchema = new Schema({
    primary: {
        type: String,
        required: true
    },
    secondary: {
        type: String,
        required: true
    }
});

module.exports = Contact = mongoose.model('Contact', ContactSchema);