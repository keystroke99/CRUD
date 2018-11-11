const { User }      = require('../models');
const authService   = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    if(!body.unique_key && !body.email && !body.phone){
        return ReE(res, 'Please enter an email or phone number to register.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password to register.');
    } else{
        let err, user;
        [err, user] = await to(authService.createUser(body));
        if(err) return ReE(res, err, 422);
        // mailer.sendEmail(user)
        Promise.all([
            ReS(res, {message:'Successfully created new user.', user:user.toWeb(), token:user.getJWT()}, 201)
          ]);
        
       
    }
}
module.exports.create = create;

// Update User
const updateUser = async function(req, res){
    // Save user in the Database
    User.findOneAndUpdate({_id: req.params.userId}, req.body, function (err, userObj) {
        if (err) return ReE(res, err);
        if (userObj) {
            return ReS(res, {
                message: 'Successfully updated the user details',
                data: userObj
            }, 201);
        }
    });
}
module.exports.updateUser = updateUser;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    return ReS(res, {user:user.toWeb()});
}
module.exports.get = get;

// get user by id
const getByUserId = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    User.findById(req.params.userId, function (err, userObject) {
        if(err) return ReE(res, err);
        if(userObject == null || userObject == "") {
           return ReE(res, {message : 'Invalid ID / No data found!'});
        }
        return ReS(res, {userData:userObject});
    });
    
}
module.exports.getByUserId = getByUserId;

// get all users
const getAllUsers = async function(req, res){
    console.log(req)
    res.setHeader('Content-Type', 'application/json');
    User.find({}, function (err, userList) {
        console.log(userList)
        if(err) return ReE(res, err);
        if(userList == null || userList == "") {
           return ReE(res, {message : 'No users found!!'});
        }
        return ReS(res, {usersData:userList});
    }).sort({ createdAt: -1 });
    
}
module.exports.getAllUsers = getAllUsers;

const update = async function(req, res){
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err){
        if(err.message.includes('E11000')){
            if(err.message.includes('phone')){
                err = 'This phone number is already in use';
            } else if(err.message.includes('email')){
                err = 'This email address is already in use';
            }else{
                err = 'Duplicate Key Entry';
            }
        }
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: '+user.email});
}
module.exports.update = update;

const remove = async function(req, res){
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');
    return ReS(res, {message:'Deleted User'}, 204);
}
module.exports.remove = remove;


const login = async function(req, res){
    const body = req.body;
    let err, user;
    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);
    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;

const logout = async function(req, res){
    let email = req.body.email.toLowerCase();
  // console.log(req.body);
  req.logout();

  res.json({
    success: true,
    message: "logout success"
  });

  User.findOne({
    email: email
  }, function (err, result) {
    let id = result._id;

    if (err) return console.log(err);

    // To update last LOGOUT time
    logOutBody = {};
    logOutBody.lastLogoutDate = new Date();

    User.findOneAndUpdate({
      _id: id
    }, logOutBody, function (err, dude) { });
  });
}
module.exports.logout = logout;

const passwordChange = async function(req, res){
    // Change password through email for Admin
    let reqbody = req.body;
    let email = req.body.email.toLowerCase();
  
      User.findOne({ email: email }, function (err, result) {
        if (err) return res.send(err);
        if (result) {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
              let reqbody = {};
              reqbody.password = hash;
              User.findOneAndUpdate({_id : result._id}, reqbody, function (err, result) {
                if (err) return res.send(err);
                res.json({
                  message: "Password updated Successfully",
                  userdata: req.body
                });
              });
            });
          });
        } else {
          res.json({
            error: "User Not Exists / Send a valid UserID"
          });
        }
      });
  // End of Change password through email
}
module.exports.passwordChange = passwordChange;