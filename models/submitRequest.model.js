const mongoose 			= require('mongoose');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let propertyTypes = ["Flat", "Mini-Flat", "Self Contained", "House", "Commercial Property", "Land"];

let submitRequestSchema = mongoose.Schema({
    referenceID: {
        type: String,
        default: null
    },
    typeOfEnquiry: {
        type: String,
        default: ""
    },
    propertyType: {
        type: String,
        default: ""
    },
    noOfBedRooms: {
        type: Number,
        default: 0
    },
    budget: {
        type: Number,
        default: 0
    },
    state: {
        type: String,
        default: ""
    },
    locality: {
        type: String,
        default: ""
    },
    comments: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    emailID: {
        type: String,
        default: ""
    },
    phoneNumber: {
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

let submitRequest = module.exports = mongoose.model('submitRequest', submitRequestSchema);