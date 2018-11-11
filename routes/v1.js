const express 		= require('express');
const router 			= express.Router();
const multer      = require('multer');


const UserController 	= require('../controllers/user.controller');
const CompanyController = require('../controllers/company.controller');
const HomeController 	= require('../controllers/home.controller');
const ListingController 	= require('../controllers/listing.controller');
const submitRequestController 	= require('../controllers/submitRequest.controller');
const mailer 	= require('../controllers/email.controller');
const teamController  = require('../controllers/team.controller');
const logoController  = require('../controllers/partnerlogos.controller');
const typeOfSaleController  = require('../controllers/typeofsale.controller');
const typeOfPropertyController  = require('../controllers/propertytype.controller');

const custom 	        = require('./../middleware/custom');
const passport      	= require('passport');
const path              = require('path');

// Multer Plugin Settings (Images Upload)
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media/listings");
  },
  filename: function (req, file, cb) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    cb(null, "1421" + "_" + date + "_" + Date.now() + "_" + file.originalname);
  }
});

let upload = multer({
  storage: storage
});
// End of Multer Plugin Settings (Images Upload)

require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

//********* WEB API's **********
router.get(     '/web/listings/getByListingId/:listingId',   ListingController.getByListingId);
router.get(     '/web/listings/getAll',                      ListingController.webGetAll);
router.post(    '/web/listings/search',                      ListingController.search);
router.post(    '/web/submitRequest',                        submitRequestController.create);
router.post(    '/web/contactus',                            submitRequestController.submitcontactus);
router.get(     '/web/listings/ourListings',                 ListingController.ourListings);
router.get(     '/web/listings/getDistressListings',         ListingController.getDistressListings);
router.get(     '/web/listings/featuredListings',            ListingController.featuredListings);
router.get(     '/web/listings/newProperties',               ListingController.newProperties);
router.get(     '/web/listings/getBanners',                  ListingController.getBanners);
router.get(     '/web/team/getTeam',                         teamController.getTeam);
router.get(     '/web/partnerlogs/getLogos',                 logoController.getpartnerLogo);

/// USER ROUTES
router.post(    '/users',                               UserController.create);                                                    // C
router.get(     '/users',                               passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.put(     '/users',                               passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete(  '/users',                               passport.authenticate('jwt', {session:false}), UserController.remove);     // D
router.get(     '/users/getAllUsers',                   passport.authenticate('jwt', {session:false}), UserController.getAllUsers);  
router.get(     '/users/getByUserId/:userId',           passport.authenticate('jwt', {session:false}), UserController.getByUserId);
router.post(    '/users/login',                         UserController.login);
router.post(    '/users/updateUser/:userId',            passport.authenticate('jwt', {session:false}), upload.any(), UserController.updateUser);
router.post(    '/users/passwordChange',                passport.authenticate('jwt', {session:false}), UserController.passwordChange);
router.post(    '/users/logout',  /*  passport.authenticate('jwt', {session:false}), */ UserController.logout);
router.post(     '/users/forgotpassword',                mailer.sendEmail);  

/// LISTING ROUTES
router.post(    '/listings',                            passport.authenticate('jwt', {session:false}),  upload.any(), ListingController.create);
router.get(     '/listings/getByListingId/:listingId',  passport.authenticate('jwt', {session:false}),  upload.any(), ListingController.getByListingId);
router.get(     '/listings/getAll',                     passport.authenticate('jwt', {session:false}), ListingController.getAll);
router.post(    '/listings/updateListing/:listingId',   passport.authenticate('jwt', {session:false}), upload.any(), ListingController.updateListing);
router.post(    '/listings/deleteMedia/:listingId',     passport.authenticate('jwt', {session:false}), ListingController.deleteMedia);
router.get(     '/dashboard/dashboardReports',          passport.authenticate('jwt', {session:false}), ListingController.dashboardReports);
router.get(     '/listings/getByStatus/:status',        ListingController.getByStatus);

/// SUBMIT REQUEST
router.post(    '/submitRequest',                          passport.authenticate('jwt', {session:false}), submitRequestController.create);
router.get(     '/submitRequest/getRequestById/:requestID',passport.authenticate('jwt', {session:false}), submitRequestController.getRequestById);
router.get(     '/submitRequest/getAll',                   passport.authenticate('jwt', {session:false}), submitRequestController.getAll);
router.get(     '/submitRequest/getMainRequests',          passport.authenticate('jwt', {session:false}), submitRequestController.getMainRequests);        
router.post(     '/submitRequest/updateSubmitRequest/:requestID',passport.authenticate('jwt', {session:false}), submitRequestController.updateSubmitRequest);

/// CONTACT US
router.get(    '/contact/getAllContactSubmissions',       passport.authenticate('jwt', {session:false}),    submitRequestController.getAllContactSubmissions);
router.get(    '/contact/getContactDetailsById/:contactFormId',  passport.authenticate('jwt', {session:false}), submitRequestController.getContactDetailsById);
router.get(    '/contact/getContactDetailsById/:contactFormId',  passport.authenticate('jwt', {session:false}), submitRequestController.getContactDetailsById);
router.post(     '/submitRequest/updateContactForm/:requestID',passport.authenticate('jwt', {session:false}), submitRequestController.updateContactForm);

/// TEAM
router.post(    '/team/create',                           passport.authenticate('jwt', {session:false}), upload.any(), teamController.create);                  // C
router.post(    '/team/update/:memberId',                           passport.authenticate('jwt', {session:false}), upload.any(), teamController.update);                  // R
router.get(     '/team/getTeamMemberById/:memberId',      passport.authenticate('jwt', {session:false}), teamController.getTeamMemberById);                  // C
router.delete(  '/team/deleteTeamMemberById/:memberId',                 passport.authenticate('jwt', {session:false}), teamController.deleteTeamMemberById);                  // R
router.get(  '/team/getAll',                 passport.authenticate('jwt', {session:false}), teamController.getAll);                  // R

/// TYPE OF SALE DROPDOWN VALUES
router.post(    '/typeofsale/create',                           passport.authenticate('jwt', {session:false}), typeOfSaleController.create);                  // C
router.post(    '/typeofsale/update/:id',                           passport.authenticate('jwt', {session:false}),  typeOfSaleController.update);                  // R
router.get(     '/typeofsale/getTypeOfSaleById/:id',      passport.authenticate('jwt', {session:false}), typeOfSaleController.gettypeOfSaleById);                  // C
router.delete(  '/typeofsale/deleteTypeOfSaleById/:id',                 passport.authenticate('jwt', {session:false}), typeOfSaleController.deletetypeOfSaleById);                  // R
router.get(  '/typeofsale/gettypeOfSale',                 passport.authenticate('jwt', {session:false}), typeOfSaleController.getAll);                  // R

/// TYPE OF PROPERTY DROPDOWN VALUES
router.post(    '/typeofproperty/create',                           passport.authenticate('jwt', {session:false}), typeOfPropertyController.create);                  // C
router.post(    '/typeofproperty/update/:id',                           passport.authenticate('jwt', {session:false}),  typeOfPropertyController.update);                  // R
router.get(     '/typeofproperty/getTypeOfPropertyById/:id',      passport.authenticate('jwt', {session:false}), typeOfPropertyController.gettypeOfPropertyById);                  // C
router.delete(  '/typeofproperty/deleteTypeOfPropertyById/:id',                 passport.authenticate('jwt', {session:false}), typeOfPropertyController.deletetypeOfPropertyById);                  // R
router.get(  '/typeofproperty/getTypeOfProperty',                 passport.authenticate('jwt', {session:false}), typeOfPropertyController.gettypeOfProperty);                  // R


/// PARTNER LOGOS
router.post(    '/partnerlogs/create',                           passport.authenticate('jwt', {session:false}), upload.any(), logoController.create);                  // C
router.post(    '/partnerlogs/update/:logoID',                           passport.authenticate('jwt', {session:false}), upload.any(), logoController.update);                  // R
router.get(     '/partnerlogs/getLogoById/:logoID',      passport.authenticate('jwt', {session:false}), logoController.getLogoById);                  // C
router.delete(  '/partnerlogs/deleteLogoById/:logoID',                 passport.authenticate('jwt', {session:false}), logoController.deleteLogoById);                  // R
router.get(  '/partnerlogs/getAll',                 passport.authenticate('jwt', {session:false}), logoController.getAll);                  // R


router.post(    '/companies',                           passport.authenticate('jwt', {session:false}), CompanyController.create);                  // C
router.get(     '/companies',                           passport.authenticate('jwt', {session:false}), CompanyController.getAll);                  // R

router.get(     '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.get);     // R
router.put(     '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.update);  // U
router.delete(  '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.remove);  // D

router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
