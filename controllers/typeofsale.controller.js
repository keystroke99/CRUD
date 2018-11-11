const typeOfSale = require('../models/typeofsale.model');
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
        
        let newtypeOfSaleObject = new typeOfSale({
            name: req.body.name,
            createdBy: req.body.createdBy
        });
        typeOfSale.create(newtypeOfSaleObject, function (err, typeOfSaleObj) {
            if (err) return ReE(res, err);
            if (typeOfSaleObj) {
                return ReS(res, {
                    message: 'Successfully created a typeOfSale.',
                    data: typeOfSaleObj
                }, 201);
            }
        });

    }
}
module.exports.create = create;



const update = async function (req, res) {
    typeOfSale.findById(req.params.id, function (err, result) {
        if (result) {
            typeOfSale.findOneAndUpdate({_id: req.params.id}, req.body, function (err, typeOfSaleObj) {
                if (err) return res.json({
                    success: false,
                    message: 'Error in updating typeOfSale',
                    error: err
                });
                if (typeOfSaleObj) {
                    return res.json({
                        success: true,
                        message: 'Successfully updated the contact form',
                        typeOfSaleData: typeOfSaleObj
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

// Get typeOfSale  By ID
const gettypeOfSaleById = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    typeOfSale.findById(ObjectId(req.params.id), function (err, reqObj) {
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
module.exports.gettypeOfSaleById = gettypeOfSaleById;

// get all submit requests
const getAll = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    typeOfSale.find({}, function (err, typeOfSaleData) {
        if (err) return ReE(res, err);
        if (typeOfSaleData == null || typeOfSaleData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            typeOfSaleData: typeOfSaleData
        });
    }).sort({ createdAt: -1 });

}
module.exports.getAll = getAll;

const deletetypeOfSaleById = async function (req, res) {
    typeOfSale.findById(req.params.id, function (err, result) {
        console.log(result)
        if (result) {
            typeOfSale.findByIdAndRemove(req.params.id, function (err, post) {
                if (err) {
                    res.json({
                        success: false,
                        message: "typeOfSale Not Exists / Send a valid ID"
                    });
                } else {
                    res.json({
                        success: true,
                        message: "Deleted typeOfSale Successfully"
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
module.exports.deletetypeOfSaleById = deletetypeOfSaleById;

// get all typeOfSale s for web
const gettypeOfSale = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    typeOfSale.find({}, function (err, typeOfSaleData) {
        if (err) return ReE(res, err);
        if (typeOfSaleData == null || typeOfSaleData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            typeOfSaleData: typeOfSaleData
        });
    });

}
module.exports.gettypeOfSale = gettypeOfSale;