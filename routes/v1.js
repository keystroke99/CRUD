const express 		= require('express');
const router 			= express.Router();
const multer      = require('multer');


const UserController 	= require('../controllers/user.controller');

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


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
