const partnerLogo = require('../models/partnerlogos.model');
const {
    to,
    ReE,
    ReS
} = require('../services/util.service');
var multer = require('multer');
let ObjectId = require("mongodb").ObjectID;

const create = async function (req, res) {
    let logoPath;
    if (!req.body.companyName) {
        return ReE(res, 'Please enter Comany Name');
    } else {
        let files = req.files || 0;
        // check if some files exists
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                // Featured Image Code Here
                if (req.files[i].fieldname == "logo") {
                    logoPath = req.files[i].path;
                }
            }
        }
        let newpartnerLogoObject = new partnerLogo({
            companyName: req.body.companyName,
            logoPath: logoPath,
            createdBy: req.body.createdBy
        });
        partnerLogo.create(newpartnerLogoObject, function (err, partnerLogoObj) {
            if (err) return ReE(res, err);
            if (partnerLogoObj) {
                return ReS(res, {
                    message: 'Successfully created a partnerLogo.',
                    data: partnerLogoObj
                }, 201);
            }
        });

    }
}
module.exports.create = create;



const update = async function (req, res) {
    let logoPath;
    let reqbody = {};
    reqbody = req.body;

    let files = req.files || 0;
    // check if some files exists
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            // Featured Image Code Here
            if (req.files[i].fieldname == "logo") {
                logoPath = req.files[i].path;
                reqbody.logoPath = logoPath;
            }
        }
    }

    partnerLogo.findOneAndUpdate({_id: req.params.logoID}, reqbody, function (err, partnerLogoObj) {
        if (err) return ReE(res, err);
        if (partnerLogoObj) {
            return ReS(res, {
                message: 'Successfully updated the partnerLogo',
                data: partnerLogoObj
            }, 201);
        }
    });

}
module.exports.update = update;

// Get partnerLogo Member By ID
const getLogoById = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    partnerLogo.findById(req.params.logoID, function (err, reqObj) {
        if (err) return ReE(res, err);
        if (reqObj == null || reqObj == "") {
            return ReE(res, {
                message: 'Invalid ID / No data found!'
            });
        }
        return ReS(res, {
            logoData: reqObj
        });
    });

}
module.exports.getLogoById = getLogoById;

// get all submit requests
const getAll = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    partnerLogo.find({}, function (err, partnerLogoData) {
        if (err) return ReE(res, err);
        if (partnerLogoData == null || partnerLogoData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            partnerLogoData: partnerLogoData
        });
    }).sort({ createdAt: -1 });

}
module.exports.getAll = getAll;

const deleteLogoById = async function (req, res) {
    let id = req.params.logoID;
    partnerLogo.findById(req.params.logoID, function (err, result) {
        if (result) {
            partnerLogo.findByIdAndRemove(id, function (err, post) {
                if (err) {
                    res.json({
                        success: false,
                        message: "Logo Not Exists / Send a valid ID"
                    });
                } else {
                    res.json({
                        success: true,
                        message: "Deleted Logo Successfully"
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
module.exports.deleteLogoById = deleteLogoById;

// get all partnerLogo members for web
const getpartnerLogo = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    partnerLogo.find({}, function (err, partnerLogoData) {
        if (err) return ReE(res, err);
        if (partnerLogoData == null || partnerLogoData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            partnerLogoData: partnerLogoData
        });
    });

}
module.exports.getpartnerLogo = getpartnerLogo;