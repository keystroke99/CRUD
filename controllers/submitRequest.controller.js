const submitRequest = require('../models/submitRequest.model');
const contactus = require('../models/contactus.model');
const authService = require('../services/auth.service');
const { to, ReE, ReS } = require('../services/util.service');
var multer = require('multer');
let ObjectId = require("mongodb").ObjectID;

const create = async function (req, res) {
    // Generate Unique Reference ID for each listing
    if (!req.body.name) {
        return ReE(res, 'Please enter Name');
    } else if (!req.body.emailID) {
        return ReE(res, 'Please enter email');
    } else if (!req.body.phoneNumber) {
        return ReE(res, 'Please enter phoneNumber');
    } else {
        // create a new submit request object
        let newSubmitRequest = new submitRequest({
            referenceID: req.body.referenceID,
            typeOfEnquiry: req.body.typeOfEnquiry,
            propertyType: req.body.propertyType,
            noOfBedRooms: req.body.noOfBedRooms,
            budget: req.body.budget,
            state: req.body.state,
            locality: req.body.locality,
            comments: req.body.comments,
            name: req.body.name,
            emailID: req.body.emailID,
            phoneNumber: req.body.phoneNumber,
            createdBy: req.body.createdBy
        });
        // Save submit request object in the Database
        submitRequest.create(newSubmitRequest ,function (err, submitRequestObj) {
            if (err) return ReE(res, err);
            if (submitRequestObj) {
                return ReS(res, { message: 'Successfully created a submit request.', data: submitRequestObj }, 201);
            }
        });

    }
}
module.exports.create = create;

// Get Request By ID
const getRequestById = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    submitRequest.findById(req.params.requestID, function (err, reqObj) {
        if (err) return ReE(res, err);
        if (reqObj == null || reqObj == "") {
            return ReE(res, { message: 'Invalid ID / No data found!' });
        }
        return ReS(res, { reqObjData: reqObj });
    });

}
module.exports.getRequestById = getRequestById;

// get all submit requests
const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    submitRequest.find({ referenceID: { $ne: null } }, function (err, requestsData) {
        if(err) return ReE(res, err);
        if(requestsData == null || requestsData == "") {
           return ReE(res, {message : 'No submit requests found!!'});
        }
        return ReS(res, {submitRequestsData:requestsData});
    }).sort({ createdAt: -1 });
    
}
module.exports.getAll = getAll;

// get all submit requests
const getMainRequests = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    submitRequest.find({ referenceID: null }, function (err, requestsData) {
        if(err) return ReE(res, err);
        if(requestsData == null || requestsData == "") {
           return ReE(res, {message : 'No submit requests found!!'});
        }
        return ReS(res, {submitRequestsData:requestsData});
    }).sort({ createdAt: -1 });
    
}
module.exports.getMainRequests = getMainRequests;

// CONTACT US

const submitcontactus = async function (req, res) {
    if (!req.body.name) {
        return ReE(res, 'Please enter Name');
    } else if (!req.body.email) {
        return ReE(res, 'Please enter Email');
    } else if (!req.body.mobile) {
        return ReE(res, 'Please enter Mobile Number');
    } else if (!req.body.subject) {
        return ReE(res, 'Please enter Subject');
    } else {
        // create a new contact us object
        let newContactRequest = new contactus({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            subject: req.body.subject,
            message: req.body.message
        });
        // Save submit request object in the Database
        contactus.create(newContactRequest ,function (err, contactRequestObj) {
            if (err) return ReE(res, err);
            if (contactRequestObj) {
                return ReS(res, { message: 'Contact form submitted successfully!', data: contactRequestObj }, 201);
            }
        });

    }
}
module.exports.submitcontactus = submitcontactus;


// get all contact requests
const getAllContactSubmissions = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    contactus.find({}, function (err, contactFormsData) {
        if(err) return ReE(res, err);
        if(contactFormsData == null || contactFormsData == "") {
           return ReE(res, {message : 'No submit requests found!!'});
        }
        return ReS(res, {contactFormsData:contactFormsData});
    }).sort({ createdAt: -1 });
    
}
module.exports.getAllContactSubmissions = getAllContactSubmissions;

// Get Contact form details By ID
const getContactDetailsById = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    contactus.findById(req.params.contactFormId, function (err, contactFormObj) {
        if (err) return ReE(res, err);
        if (contactFormObj == null || contactFormObj == "") {
            return ReE(res, { message: 'Invalid ID / No data found!' });
        }
        return ReS(res, { contactFormData: contactFormObj });
    });

}
module.exports.getContactDetailsById = getContactDetailsById;


// UPDATE SUBMIT REQUEST
const updateSubmitRequest = async function (req, res) {
    submitRequest.findById(req.params.requestID, function (err, result) {
        if (result) {
            submitRequest.findOneAndUpdate({_id: req.params.requestID}, req.body, function (err, submitRequestObj) {
                if (err) return res.json({
                    success: false,
                    message: 'Error in updating submitRequest',
                    error: err
                });
                if (submitRequestObj) {
                    return res.json({
                        success: true,
                        message: 'Successfully updated the submitRequest',
                        submitRequestData: submitRequestObj
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: "Not Found / Send a valid ID"
            });
        }
    });

}
module.exports.updateSubmitRequest = updateSubmitRequest;


// UPDATE CONTACT FORM
const updateContactForm = async function (req, res) {
    contactus.findById(req.params.requestID, function (err, result) {
        if (result) {
            contactus.findOneAndUpdate({_id: req.params.requestID}, req.body, function (err, submitRequestObj) {
                if (err) return res.json({
                    success: false,
                    message: 'Error in updating submitRequest',
                    error: err
                });
                if (submitRequestObj) {
                    return res.json({
                        success: true,
                        message: 'Successfully updated the contact form',
                        submitRequestData: submitRequestObj
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: "Not Found / Send a valid ID"
            });
        }
    });

}
module.exports.updateContactForm = updateContactForm;






















const remove = async function (req, res) {
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if (err) return ReE(res, 'error occured trying to delete user');
    return ReS(res, { message: 'Deleted User' }, 204);
}
module.exports.remove = remove;
