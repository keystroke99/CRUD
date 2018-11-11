const mongoose 			= require('mongoose');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let contactUsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'responded'],
        default: 'pending'
    },
    remarks: {
        type: String,
        default: ""
    },
    updatedBy: {
        type: String,
        default: ""
    },

}, {
    timestamps: true
});

let contactUs = module.exports = mongoose.model('contactUs', contactUsSchema);