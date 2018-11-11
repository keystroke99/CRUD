const mongoose 			= require('mongoose');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let typeOfSaleSchema = mongoose.Schema({
    name: {
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

let typeOfSale = module.exports = mongoose.model('typeofsales', typeOfSaleSchema);