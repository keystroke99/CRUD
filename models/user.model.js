const mongoose 			= require('mongoose');
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let roles = ["user", "admin", "superAdmin"];

let UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
        validate: [validate({
            validator: 'isEmail',
            message: 'Not a valid email.',
        }), ]
    },
    password: {
        type: String
    },
    mobileNumber: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        sparse: true, // sparse is because now we have two possible unique keys that are optional
        validate: [validate({
            validator: 'isNumeric',
            arguments: [7, 20],
            message: 'Not a valid mobile number.',
        })]
    },
    mobileCountryCode: {
        type: String,
        lowercase: true,
        trim: true,
        index: true
    },
    address: {
        type: String,
        lowercase: true,
        trim: true,
        index: true
    },
    location: {
        type: String,
        lowercase: true,
        trim: true,
        index: true
    },
    city: {
        type: String,
        lowercase: true,
        trim: true,
        index: true
    },
    country: {
        type: String,
        lowercase: true,
        trim: true,
        index: true
    },
    role: {
        type: String,
        enum: roles,
        default: "user"
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
    lastLoginDate: { type: Date, default: "" },
    lastLogoutDate: { type: Date, default: "" },
}, {
    timestamps: true
});


UserSchema.pre('save', async function (next) {

    if (this.isModified('password') || this.isNew) {

        let err, salt, hash;
        [err, salt] = await to(bcrypt.genSalt(10));
        if (err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(this.password, salt));
        if (err) TE(err.message, true);

        this.password = hash;

    } else {
        return next();
    }
})

UserSchema.methods.comparePassword = async function (pw) {
    let err, pass;
    if (!this.password) TE('password not set');

    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('invalid password');

    return this;
}

UserSchema.virtual('full_name').set(function (name) {
    var split = name.split(' ');
    this.firstName = split[0];
    this.lastName = split[1];
});

UserSchema.virtual('full_name').get(function () { //now you can treat as if this was a property instead of a function
    if (!this.firstName) return null;
    if (!this.lastName) return this.firstName;

    return this.firstName + ' ' + this.lastName;
});

UserSchema.methods.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return "Bearer " + jwt.sign({
        user_id: this._id
    }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time
    });
};

UserSchema.methods.toWeb = function () {
    let json = this.toJSON();
    json.id = this._id; //this is for the front end
    return json;
};

let User = module.exports = mongoose.model('User', UserSchema);