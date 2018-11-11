const typeOfProperty = require('../models/propertytype.model');
const {
    to,
    ReE,
    ReS
} = require('../services/util.service');
var multer = require('multer');
let ObjectId = require("mongodb").ObjectID;

const create = async function (req, res) {
    let profilePicPath;
    if (!req.body.name) {
        return ReE(res, 'Please enter Name');
    } else {
        
        let newtypeOfPropertyObject = new typeOfProperty({
            name: req.body.name,
            createdBy: req.body.createdBy
        });
        typeOfProperty.create(newtypeOfPropertyObject, function (err, typeOfPropertyObj) {
            if (err) return ReE(res, err);
            if (typeOfPropertyObj) {
                return ReS(res, {
                    message: 'Successfully created a typeOfProperty.',
                    data: typeOfPropertyObj
                }, 201);
            }
        });

    }
}
module.exports.create = create;



const update = async function (req, res) {
    typeOfProperty.findById(req.params.id, function (err, result) {
        if (result) {
            typeOfProperty.findOneAndUpdate({_id: req.params.id}, req.body, function (err, typeOfPropertyObj) {
                if (err) return res.json({
                    success: false,
                    message: 'Error in updating typeOfProperty',
                    error: err
                });
                if (typeOfPropertyObj) {
                    return res.json({
                        success: true,
                        message: 'Successfully updated the typeOfProperty',
                        typeOfPropertyData: typeOfPropertyObj
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
module.exports.update = update;

// Get typeOfProperty  By ID
const gettypeOfPropertyById = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.params)
    typeOfProperty.findById(ObjectId(req.params.id), function (err, reqObj) {
        if (err) return ReE(res, err);
        console.log(reqObj)
        if (reqObj == null || reqObj == "") {
            return ReE(res, {
                message: 'Invalid ID / No data found!'
            });
        }
        return ReS(res, {
            Data: reqObj
        });
    });

}
module.exports.gettypeOfPropertyById = gettypeOfPropertyById;

// get all submit requests
const getAll = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    typeOfProperty.find({}, function (err, typeOfPropertyData) {
        if (err) return ReE(res, err);
        if (typeOfPropertyData == null || typeOfPropertyData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            typeOfPropertyData: typeOfPropertyData
        });
    }).sort({ createdAt: -1 });

}
module.exports.getAll = getAll;

const deletetypeOfPropertyById = async function (req, res) {
    typeOfProperty.findById(req.params.id, function (err, result) {
        console.log(result)
        if (result) {
            typeOfProperty.findByIdAndRemove(req.params.id, function (err, post) {
                if (err) {
                    res.json({
                        success: false,
                        message: "typeOfProperty Not Exists / Send a valid ID"
                    });
                } else {
                    res.json({
                        success: true,
                        message: "Deleted typeOfProperty Successfully"
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
module.exports.deletetypeOfPropertyById = deletetypeOfPropertyById;

// get all typeOfProperty s for web
const gettypeOfProperty = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    typeOfProperty.find({}, function (err, typeOfPropertyData) {
        if (err) return ReE(res, err);
        if (typeOfPropertyData == null || typeOfPropertyData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            typeOfPropertyData: typeOfPropertyData
        });
    });

}
module.exports.gettypeOfProperty = gettypeOfProperty;