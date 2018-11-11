const Listing = require('../models/listing.model');
const authService = require('../services/auth.service');
const {
    to,
    ReE,
    ReS
} = require('../services/util.service');
var multer = require('multer');
let ObjectId = require("mongodb").ObjectID;

const create = async function (req, res) {
    let referenceID;
    let areaCode;
    let propertyType;
    let featuredImagePath;
    let sliderImagePath;
    let media = [];
    // Generate Unique Reference ID for each listing
    if (!req.body.area) {
        return ReE(res, 'Please enter Area');
    } else if (!req.body.propertyType) {
        return ReE(res, 'Please enter a property type');
    } else if (!req.body.listingTitle) {
        return ReE(res, 'Please enter a Title for the Listing');
    } else if (!req.body.city) {
        return ReE(res, 'Please enter City');
    } else if (!req.body.state) {
        return ReE(res, 'Please enter State');
    } else if (!req.body.listingTitle) {
        return ReE(res, 'Please enter a Title for the Listing');
    } else if (!req.body.createdBy) {
        return ReE(res, 'Please enter createdBy ID');
    } else if ((!req.body.noOfBedRooms) || (!req.body.noOfBathRooms) || (!req.body.areainSqFt)) {
        return ReE(res, 'Please enter noOfBedRooms / noOfBathRooms ');
    } else {
        areaCode = (req.body.area).slice(0, 2);
        propertyType = (req.body.propertyType).slice(0, 2);
        let dt = new Date();
        let year = dt.getFullYear();
        let month = dt.getMonth();
        let date = dt.getDate();
        let hrs = dt.getHours();
        let mins = dt.getMinutes();
        let ms = dt.getMilliseconds();
        referenceID = "1421 -" + areaCode.toUpperCase() + propertyType.toUpperCase() + year + month + date + hrs + mins + ms;

        let files = req.files || 0;
        console.log(req.files)
        // check if some files exists
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                // Featured Image Code Here
                if (req.files[i].fieldname == "featuredImage") {
                    featuredImagePath = req.files[i].path;
                }
                // Upload all other images of the listing
                if (req.files[i].fieldname == "media") {
                    let mediaObject = {};
                    let mediaType;
                    fileType = req.files[i].mimetype;
                    let mediaUrl;
                    let mediaName;
                    if ((fileType == "image/gif") || (fileType == "image/jpeg") || (fileType == "image/png") || (fileType == "image/tiff")) {
                        mediaType = "image";
                        mediaUrl = req.files[i].path;
                        mediaName = req.files[i].filename;
                    } else if ((fileType == "video/mpeg") || (fileType == "video/ogg") || (fileType == "video/webm") || (fileType == "video/3gpp") || (fileType == "video/mp4") || (fileType == "video/x-flv")) {
                        mediaType = "video";
                        mediaUrl = req.files[i].path;
                        mediaUrl = req.files[i].filename;
                    }
                    mediaObject.mediaId = new ObjectId();
                    mediaObject.mediaType = mediaType;
                    mediaObject.mediaUrl = mediaUrl;
                    mediaObject.mediaName = mediaName
                    media.push(mediaObject);
                }
                // Uplaod Slider Image
                // Featured Image Code Here
                if (req.files[i].fieldname == "sliderImage") {
                    sliderImagePath = req.files[i].path;
                }
            }
        }
        // create a new Listing Objct
        let newListing = new Listing({
            referenceID: referenceID,
            listingTitle: req.body.listingTitle,
            listingDescription: req.body.listingDescription,
            typeOfSale: req.body.typeOfSale,
            propertyType: req.body.propertyType,
            area: req.body.area,
            price: req.body.price,
            noOfBedRooms: req.body.noOfBedRooms,
            noOfBathRooms: req.body.noOfBathRooms,
            noOfSittingRooms: req.body.noOfSittingRooms,
            noOfBQ: req.body.noOfBQ,
            amenities: req.body.amenities,
            areainSqFt: req.body.areainSqFt,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            featuredImagePath: featuredImagePath,
            media: media,
            isSliderEnabled: req.body.isSliderEnabled,
            sliderImagePath: sliderImagePath,
            createdBy: req.body.createdBy,
        });
        // Save listing in the Database
        newListing.save(function (err, listingObj) {
            if (err) return ReE(res, err);
            if (listingObj) {
                return ReS(res, {
                    message: 'Successfully created a new Listing.',
                    data: listingObj
                }, 201);
            }
        });

    }
}
module.exports.create = create;

// Update listing with media
const updateListing = async function (req, res) {
    let featuredImagePath;
    let media = [];
    let sliderImagePath;
    let reqbody = {};
    reqbody = req.body;

    let files = req.files || 0;
    console.log(req.files)
    // check if some files exists
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            // Featured Image Code Here
            if (req.files[i].fieldname == "featuredImage") {
                featuredImagePath = req.files[i].path;
                reqbody.featuredImagePath = featuredImagePath;
            }
            // Upload all other images of the listing
            if (req.files[i].fieldname == "media") {
                let mediaObject = {};
                let mediaType;
                fileType = req.files[i].mimetype;
                let mediaUrl;
                let mediaName;
                if ((fileType == "image/gif") || (fileType == "image/jpeg") || (fileType == "image/png") || (fileType == "image/tiff")) {
                    mediaType = "image";
                    mediaUrl = req.files[i].path;
                    mediaName = req.files[i].filename;
                } else if ((fileType == "video/mpeg") || (fileType == "video/ogg") || (fileType == "video/webm") || (fileType == "video/3gpp") || (fileType == "video/mp4") || (fileType == "video/x-flv")) {
                    mediaType = "video";
                    mediaUrl = req.files[i].path;
                    mediaUrl = req.files[i].filename;
                }
                mediaObject.mediaId = new ObjectId();
                mediaObject.mediaType = mediaType;
                mediaObject.mediaUrl = mediaUrl;
                mediaObject.mediaName = mediaName
                media.push(mediaObject);
            }
            if (req.files[i].fieldname == "sliderImage") {
                sliderImagePath = req.files[i].path;
                reqbody.sliderImagePath = sliderImagePath;
            }
        }
    }

    
    
    

    // Save listing in the Database
    Listing.findOneAndUpdate({_id: req.params.listingId}, reqbody, function (err, listingObj) {
        if (err) return ReE(res, err);
        if (listingObj) {
            if(media.length > 0) {
                Listing.findByIdAndUpdate({_id: req.params.listingId}, {$push : {media: media}}, function (err, listingObj) {
                    
                });
            }
            return ReS(res, {
                message: 'Successfully updated the listing',
                data: listingObj
            }, 201);
        }
    });

}

module.exports.updateListing = updateListing;

// Get by Listing ID
const getByListingId = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.findById(req.params.listingId, function (err, listingObj) {
        if (err) return ReE(res, err);
        if (listingObj == null || listingObj == "") {
            return ReE(res, {
                message: 'Invalid ID / No data found!'
            });
        } else {
            let query = {
                $or: [{
                    propertyType: listingObj.propertyType
                }, {
                    area: listingObj.area
                }]
            }
            Listing.find(query, {
                limit: 3
            }, function (err, similarProductsData) {
                if (err) return ReE(res, err);
                if (similarProductsData == null || similarProductsData == "" || similarProductsData.length == 0) {
                    return ReE(res, {
                        message: 'No similar listing found!!'
                    });
                } else {
                    return ReS(res, {
                        listingsData: listingObj,
                        similarProductsData: [listingObj]
                    });
                }
            });
        }
    });

}
module.exports.getByListingId = getByListingId;

// get all Listings
const getAll = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.find({}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return ReE(res, {
                message: 'No listings found!!'
            });
        }
        return ReS(res, {
            listingsData: listingsData
        });
    }).sort({ createdAt: -1 });

}
module.exports.getAll = getAll;

// get all Listings
const webGetAll = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.find({isActive : true}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return ReE(res, {
                message: 'No listings found!!'
            });
        }
        return ReS(res, {
            listingsData: listingsData
        });
    }).sort({ createdAt: -1 });

}
module.exports.webGetAll = webGetAll;

// Our Listings Section in Homepage
const ourListings = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.find({isActive : true}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return ReE(res, {
                message: 'No listings found!!'
            });
        }
        return ReS(res, {
            listingsData: listingsData
        });
    }).sort({ createdAt: -1 }).limit(6);
}
module.exports.ourListings = ourListings;

// Featured Listings section in Sidebar
const featuredListings = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.find({isActive : true}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return ReE(res, {
                message: 'No listings found!!'
            });
        }
        return ReS(res, {
            listingsData: listingsData
        });
    }).sort({ createdAt: -1 }).limit(5);
}
module.exports.featuredListings = featuredListings;

// Distress Listings section in Sidebar
const getDistressListings = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.find({"typeOfSale" : "Distress Sale", isActive : true}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return ReE(res, {
                message: 'No listings found!!'
            });
        }
        return ReS(res, {
            listingsData: listingsData
        });
    }).sort({ createdAt: -1 });
}
module.exports.getDistressListings = getDistressListings;

// get banner images
const getBanners = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.find({isSliderEnabled: true, isActive: true}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return ReE(res, {
                message: 'No listings found!!'
            });
        }
        return ReS(res, {
            listingsData: listingsData
        });
    }).sort({ createdAt: -1 });

}
module.exports.getBanners = getBanners;

// Delete Media Files from Listing
const deleteMedia = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.updateOne({ _id: req.params.listingId }, { "$pull": { "media": { "_id": { $in: req.body.mediaArray } } } }, function (err, updatedData) {
        if (err) return ReE(res, err);
        else {
            return ReS(res, {
                message: 'media deleted successfully!'
            });
        }
    });

}
module.exports.deleteMedia = deleteMedia;

// New Properties
const newProperties = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    Listing.find({isActive : true}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return ReE(res, {
                message: 'No listings found!!'
            });
        }
        return ReS(res, {
            listingsData: listingsData
        });
    }).limit(5).sort({ createdAt: -1 });

}
module.exports.newProperties = newProperties;


const update = async function (req, res) {
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if (err) {
        if (err.message.includes('E11000')) {
            if (err.message.includes('phone')) {
                err = 'This phone number is already in use';
            } else if (err.message.includes('email')) {
                err = 'This email address is already in use';
            } else {
                err = 'Duplicate Key Entry';
            }
        }
        return ReE(res, err);
    }
    return ReS(res, {
        message: 'Updated User: ' + user.email
    });
}
module.exports.update = update;

// Search API
const search = async function (req, res) {
    // Search Terms
    let sortyBy = req.body.sortyBy;
    let area = req.body.area;
    let propertyType = req.body.propertyType;
    let noOfBedRooms = req.body.noOfBedRooms;
    let noOfBathRooms = req.body.noOfBathRooms;
    let sortObject = {};
    console.log(req.body)
    let query = [{}];
    if (sortyBy != null && sortyBy != "null") {
        if (sortyBy == 'Default') {
            // All
            sortObject = {
                createdAt: 1
            };
        } else if (sortyBy == 'Highest') {
            // Highest Price First
            sortObject = {
                price: 1
            }
        } else if (sortyBy == 'Lowest') {
            // Lowest Price First 
            sortObject = {
                price: -1
            }
        } else if (sortyBy == 'Recent') {
            // Latest First
            sortObject = {
                createdAt: -1
            }
        }
    }
    if (area != null && area != "null") {
        query.push({
            area: area
        });
    }
    if (propertyType != null && propertyType != "null") {
        query.push({
            propertyType: propertyType
        });
    }
    if (noOfBedRooms != null && noOfBedRooms != "null") {
        query.push({
            noOfBedRooms: {
                $eq: parseInt(noOfBedRooms)
            }
        });
    }
    if (noOfBathRooms != null && noOfBathRooms != "null") {
        query.push({
            "noOfBathRooms": {
                $eq: parseInt(noOfBathRooms)
            }
        });
    }
    Listing.aggregate(
        [
            {
                $match: {
                    $and: query
                },
            },
            {
                $sort: sortObject
            }
        ],
        function (err, listingsData) {
            if (err) {
                ReE(res, err)
            } else {

                if (listingsData == undefined || listingsData == 'undefined') {
                    ReE(res, {
                        "message": "No results found!! Cheez :)"
                    })
                } else if (listingsData != undefined) {
                    if (listingsData.length > 0) {
                        return ReS(res, {
                            listingsData: listingsData
                        });
                    } else {
                        ReE(res, {
                            "message": "No results found!! Cheez :)"
                        })
                    }
                } else {
                    ReE(res, {
                        "message": "No results found!! Cheez :)"
                    })
                }
            }
        }
    );
}
module.exports.search = search;




















const remove = async function (req, res) {
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if (err) return ReE(res, 'error occured trying to delete user');
    return ReS(res, {
        message: 'Deleted User'
    }, 204);
}
module.exports.remove = remove;


const login = async function (req, res) {
    const body = req.body;
    let err, user;
    [err, user] = await to(authService.authUser(req.body));
    if (err) return ReE(res, err, 422);
    return ReS(res, {
        token: user.getJWT(),
        user: user.toWeb()
    });
}
module.exports.login = login;

const dashboardReports = async function (req, res) {
    let totalListings = await Listing.find({}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return 0;
        } else {
            console.log(listingsData.length)
            return listingsData.length;
        }
        
    }).count();
    let approvedListings = await Listing.find({isActive : true, status: 'approved'}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return 0;
        } else {
            console.log(listingsData.length)
            return listingsData.length;
        }
        
    }).count();
    let pendingListings = await Listing.find({status: 'pending'}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return 0;
        } else {
            console.log(listingsData.length)
            return listingsData.length;
        }
        
    }).count();
    let soldListings = await Listing.find({status: 'sold'}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return 0;
        } else {
            console.log(listingsData.length)
            return listingsData.length;
        }
        
    }).count();
    let rejectedListings = await Listing.find({status: 'rejected'}, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData == null || listingsData == "") {
            return 0;
        } else {
            console.log(listingsData.length)
            return listingsData.length;
        }
        
    }).count();
    res.status(200).json({
        totalListings : totalListings,
        approvedListings: approvedListings,
        pendingListings: pendingListings,
        soldListings: soldListings,
        rejectedListings: rejectedListings
    });
}
module.exports.dashboardReports = dashboardReports;

const getByStatus = async function (req, res) {
    let status = req.params.status;
    let query;
    if(status == 'approved') {
        query = {isActive: true, status: 'approved'}
    } else if (status == 'pending') {
        query = {status: 'pending'}
    } else if (status == 'rejected') {
        query = {status: 'rejected'}
    } else if (status == 'sold') {
        query = {status: 'sold'}
    } else {
        query = {}
    }

    Listing.find(query, function (err, listingsData) {
        if (err) return ReE(res, err);
        if (listingsData.length == 0 || listingsData == null || listingsData == "") {
            res.status(500).json({
                success : 0,
                "message" : "No data found!"
            })
        } else {
            res.status(200).json({
                success: 1,
                listingsData: listingsData
            })
        }
        
    }).sort({createdAt: -1});

}
module.exports.getByStatus = getByStatus;