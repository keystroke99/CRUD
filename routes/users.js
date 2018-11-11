var express = require('express');
var router = express.Router();
var User = require('../models/users.model');
var Contact = require('../models/contacts.model');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Create User
router.post('/create', function (req, res, next) {
  let newUser = new User(req.body);
  newUser.save(function (err, userObj) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'failed to save the doc',
        data: err
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'user successfully registered',
        data: userObj
      })
    }
  });
});

// GET User
router.get('/getById/:userId', function (req, res, next) {
  User.
  findOne({ _id: req.params.userId }).
  populate('contacts').
  exec(function (err, userObj) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'failed to get the doc',
        data: err
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'user data successfully fetched',
        data: userObj
      })
    }
  });
});

// Update User
router.post('/update/:userId', function (req, res, next) {
  let id = req.params.userId;
  User.findById(id, function (err, userObj) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'User not found',
        data: err
      })
    } else {
      let newUser = userObj;
      User.findOneAndUpdate({_id: id}, { $set: req.body}, { new: true }, function (err, updatedUserObj) {
        if (err) {
          res.status(500).json({
            success: false,
            message: 'failed to save the doc',
            data: err
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'user successfully updated',
            data: updatedUserObj
          })
        }
      });
    }
  });
});

// Create Contact
router.post('/contacts/create', function (req, res, next) {
  let newContact = new Contact(req.body);
  newContact.save(function (err, contactObj) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'failed to save the doc',
        data: err
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'contact successfully saved',
        data: contactObj
      })
    }
  });
});
module.exports = router;