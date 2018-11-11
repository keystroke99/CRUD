const mongoose 			= require('mongoose');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let teamSchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    profilePicPath: {
        type: String,
        default: "media/listings/featuredimage.PNG"
    },
    designation: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    facebook: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    googlePlus: {
        type: String,
        default: ""
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

let Team = module.exports = mongoose.model('team', teamSchema);