const mongoose = require('mongoose');

let ListingSchema = mongoose.Schema({
    referenceID: {
        type: String
    },
    listingTitle: {
        type: String,
        required: true
    },
    listingDescription: {
        type: String,
        default: ""
    },
    typeOfSale: {
        type: String,
        default: ""
    },
    propertyType: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    noOfBedRooms: {
        type: Number,
        required: true
    },
    noOfBathRooms: {
        type: Number,
        required: true
    },
    noOfSittingRooms: {
        type: Number,
        default: 0
    },
    noOfBQ: {
        type: Number,
        default: 0
    },
    amenities: {
        type: Array,
        default: []
    },
    areainSqFt: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        default: ""
    },
    featuredImagePath: {
        type: String,
        default: "media/listings/featuredimage.PNG"
    },
    media: [{
        mediaId: mongoose.Schema.Types.ObjectId,
        mediaType: {
            type: String,
            default: "",
            enum: ["image", "video"]
        },
        mediaUrl: {
            type: String,
            default: "media/listings/featuredimage.PNG"
        },
        mediaName: {
            type: String,
            default: ""
        },

    }],
    isSliderEnabled: {
        type: Boolean,
        default: false
    },
    sliderImagePath: {
        type: String,
        default: "media/listings/featuredimage.PNG"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'sold'],
        default: 'pending'
    },
    remarks: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

let Listing = module.exports = mongoose.model('Listing', ListingSchema);