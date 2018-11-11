const mongoose 			= require('mongoose');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let partnerLogosSchema = mongoose.Schema({
    companyName: {
        type: String,
        default: ""
    },
    logoPath: {
        type: String,
        default: "media/listings/featuredimage.PNG"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
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

let partnerLogo = module.exports = mongoose.model('partnerlogos', partnerLogosSchema);