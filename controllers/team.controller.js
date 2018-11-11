const Team = require('../models/team.model');
const {
    to,
    ReE,
    ReS
} = require('../services/util.service');
var multer = require('multer');
let ObjectId = require("mongodb").ObjectID;

const create = async function (req, res) {
    console.log(req.body)
    let profilePicPath;
    if (!req.body.name) {
        return ReE(res, 'Please enter Name');
    } else if (!req.body.designation) {
        return ReE(res, 'Please enter Designation');
    } else if (!req.body.description) {
        return ReE(res, 'Please enter Description');
    } else {
        let files = req.files || 0;
        // check if some files exists
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                // Featured Image Code Here
                if (req.files[i].fieldname == "profilePic") {
                    profilePicPath = req.files[i].path;
                }
            }
        }
        let newTeamObject = new Team({
            name: req.body.name,
            designation: req.body.designation,
            description: req.body.description,
            profilePicPath: profilePicPath,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            linkedin: req.body.linkedin,
            googlePlus: req.body.googlePlus,
            createdBy: req.body.createdBy
        });
        Team.create(newTeamObject, function (err, teamObj) {
            if (err) return ReE(res, err);
            if (teamObj) {
                return ReS(res, {
                    message: 'Successfully created a Team member.',
                    data: teamObj
                }, 201);
            }
        });

    }
}
module.exports.create = create;



const update = async function (req, res) {
    let profilePicPath;
    let reqbody = {};
    reqbody = req.body;

    let files = req.files || 0;
    // check if some files exists
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            // Featured Image Code Here
            if (req.files[i].fieldname == "profilePic") {
                profilePicPath = req.files[i].path;
                reqbody.profilePicPath = profilePicPath;
            }
        }
    }

    Team.findOneAndUpdate({_id: req.params.memberId}, reqbody, function (err, teamObj) {
        if (err) return ReE(res, err);
        if (teamObj) {
            return ReS(res, {
                message: 'Successfully updated the team member data',
                data: teamObj
            }, 201);
        }
    });

}
module.exports.update = update;

// Get Team Member By ID
const getTeamMemberById = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Team.findById(req.params.memberId, function (err, reqObj) {
        if (err) return ReE(res, err);
        if (reqObj == null || reqObj == "") {
            return ReE(res, {
                message: 'Invalid ID / No data found!'
            });
        }
        return ReS(res, {
            memberData: reqObj
        });
    });

}
module.exports.getTeamMemberById = getTeamMemberById;

// get all submit requests
const getAll = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Team.find({}, function (err, teamData) {
        if (err) return ReE(res, err);
        if (teamData == null || teamData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            TeamData: teamData
        });
    }).sort({ createdAt: -1 });

}
module.exports.getAll = getAll;

const deleteTeamMemberById = async function (req, res) {
    let id = req.params.memberId;
    Team.findById(req.params.memberId, function (err, result) {
        if (result) {
            Team.findByIdAndRemove(id, function (err, post) {
                if (err) {
                    res.json({
                        success: false,
                        message: "User Not Exists / Send a valid ID"
                    });
                } else {
                    res.json({
                        success: true,
                        message: "Deleted User Successfully"
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
module.exports.deleteTeamMemberById = deleteTeamMemberById;

// get all team members for web
const getTeam = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Team.find({}, function (err, teamData) {
        if (err) return ReE(res, err);
        if (teamData == null || teamData == "") {
            return ReE(res, {
                message: 'No Data!!'
            });
        }
        return ReS(res, {
            TeamData: teamData
        });
    });

}
module.exports.getTeam = getTeam;