const express = require('express'),
  app = express(),
  http = require('http'),
  url = require('url'),
  mysql = require('mysql'),
  server = http.createServer(app),
  request = require('request'),
  querystring = require('querystring'),
  bodyParser = require('body-parser'),
  _ = require('underscore'),
  async = require("async"),
  QRCode = require('qrcode'),
  uuid = require('uuid/v1'),
  fs = require('fs'),
  port = 3402

const bcrypt = require('bcrypt');  
const nodemailer = require('nodemailer');
const dateFormat = require('dateformat');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/user');
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
});
var upload = multer({ storage: storage });

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Include@123AI",
  database: "fluxmission",
  multipleStatements: true,
  //charset: 'utf8',
  charset: 'utf8mb4'
});

con.connect(function (err) {
  if (err) {
    console.log("Error : " + err)
    throw err;
  }
  console.log("Connected!");
});

app.get('/', (req, res) => {
  res.send('yes the server is working properly' + port)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

//=============================================================User================================================================
let base_url = 'http://flux-qa.com/uploads/mission/';
let user_image_url = 'http://flux-qa.com/uploads/user/';
let email_logo = 'http://flux-qa.com/assets/frontend/image/';
let banner_image = 'http://flux-qa.com/uploads/slider/';
let pdf_url = 'http://flux-qa.com/uploads/support/';
let notification_image_url = 'http://flux-qa.com/uploads/notifications/';

// Device Token Update

app.post('/updateDeviceToken', function (req, res) {
  var userID = req.body.userID;
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  if (userID == "") {
    res.json({
      status: 0,
      message: 'Please enter a userID',
    });
  } else {
    con.query('select * from users where id = "' + userID + '"', function (error, selectedRows, fields) {
      if (selectedRows.length > 0) {
        con.query('select * from users where id = "' + userID + '"', function (customerError, customerRows, fields) {
          if (!error) {
            if (customerRows.length > 0) {
              var updateFcmQuery = con.query('UPDATE users SET deviceToken = "' + deviceToken + '", deviceName = "' + deviceName + '" WHERE  id = "' + userID + '"', (errorUpdating, rows, fields) => {
                if (!errorUpdating) {
                  let userId = selectedRows[0].id;
                  var jsonObj = ({
                    userId: selectedRows[0].id,
                    username: selectedRows[0].username,
                    firstname: selectedRows[0].firstname,
                    lastname: selectedRows[0].lastname,
                    email: selectedRows[0].email,
                    phone: selectedRows[0].phone
                  });
                  res.json({
                    status: 1,
                    message: 'Device Token Update Successfully',
                    data: jsonObj
                  });
                } else {
                  res.json(errorUpdating)
                }
              });
            } else {
              res.json({
                status: 0,
                message: 'Incorrect User ID',
                data: []
              });
            }
          } else {
            json.res(error)
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'Please enter a valid user id',
          data: []
        });
      }
    });
  }
});

// Login API

app.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;

  if (email == "") {
    res.json({
      status: 0,
      message: 'Please enter a email address',
    });
  } else {
    con.query('select * from users where email = "' + email + '"', function (error, selectedRows, fields) {
      if (selectedRows.length > 0) {
        if ((selectedRows[0].email_verify != '') && (selectedRows[0].email_verify != '0')) {
          res.json({
            status: 0,
            message: 'Please verify your email address',
            data: []
          });
        } else { 
          var passwordmatch = selectedRows[0].password;
          var passwordMatch = false;
          bcrypt.compare(password, passwordmatch.replace(/^\$2y(.+)$/i, '\$2a$1'), function (err, result) {
            passwordMatch = result;
            if (passwordMatch == true) {
              con.query('select * from users where email = "' + email + '"', function (customerError, customerRows, fields) {
                if (!error) {
                  if (customerRows.length > 0) {
                    var updateFcmQuery = con.query('UPDATE users SET deviceToken = "' + deviceToken + '", deviceName = "' + deviceName + '" WHERE  email = "' + email + '"', (errorUpdating, rows, fields) => {
                      if (!errorUpdating) {
                        let userId = selectedRows[0].id;
                        var jsonObj = ({
                          userId: selectedRows[0].id,
                          username: selectedRows[0].username,
                          firstname: selectedRows[0].firstname,
                          lastname: selectedRows[0].lastname,
                          email: selectedRows[0].email,
                          phone: selectedRows[0].phone
                        });

                        res.json({
                          status: 1,
                          message: 'Login Successfully',
                          data: jsonObj
                        });
                      }
                      else {
                        res.json(errorUpdating)
                      }
                    });
                  } else {
                    res.json({
                      status: 0,
                      message: 'Incorrect Password',
                      data: []
                    });
                  }
                } else {
                  json.res(error)
                }
              })
            } else {
              res.json({
                status: 0,
                message: 'Please enter a valid password',
                data: []
              });
            }
          });
        }
      } else {
        res.json({
          status: 0,
          message: 'Please enter a valid email address',
          data: []
        });
      }
    });
  }
});

// Singup API

app.post('/signup', function (req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = firstname + ' ' + lastname;
  var email = req.body.email;
  if (req.body.phone != '') {
    var phone = req.body.phone;
  } else {
    var phone = '';
  }
  var password = req.body.password;
  let newpassword = bcrypt.hashSync(password, 10);
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  var status = '1';
  var otp = '0';
  var image = 'avatar.png';
  var time_zone = '';
  var currency = '';
  var notification_mystuff = 'Off';
  var notification_mymission = 'Off';
  var notification_myprofile = 'Off';
  var notification_joinmission = 'Off';
  var privacy_Terms = req.body.privacy_Terms;
  let email_verify = Math.floor(1000 + Math.random() * 9000);

  con.query('select * from users where email = "' + email + '"', function (error, selectedRows, fields) {
    if (!error) {
      if (selectedRows.length > 0) {
        if (email == selectedRows[0].email) {
          res.json({
            status: 0,
            message: 'Email Already Exist',
          });
        }
      } else {
        con.query('INSERT INTO users(`username`,`firstname`,`lastname`,`email`,`password`,`phone`,`status`,`otp`,`image`,`time_zone`,`currency`,`notification_mystuff`,`notification_mymission`,`notification_myprofile`,`notification_joinmission`,`privacy_Terms`,`email_verify`,`deviceName`,`deviceToken`) VALUES ("' + username + '","' + firstname + '","' + lastname + '","' + email + '","' + newpassword + '","' + phone + '","' + status + '","' + otp + '","' + image + '","' + time_zone + '","' + currency + '","' + notification_mystuff + '","' + notification_mymission + '","' + notification_myprofile + '","' + notification_joinmission + '","' + privacy_Terms + '","' + email_verify + '","' + deviceName + '","' + deviceToken + '")', function (err, results, fields) {
          if (!err) {
            var jsonObj = ({
              userId: results.insertId,
              username: username,
              firstname: firstname,
              lastname: lastname,
              email: email,
              phone: phone
            });

            //----------------------email send start---------------------------//
            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              auth: {
                user: 'noreplyfluxmission@gmail.com',
                pass: 'Include!23'
              }
            });
            var mailOptions = {
              from: 'noreplyfluxmission@gmail.com',
              to: email,
              subject: 'Flux Mission - Sign Up',
              html: '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<title>Flux Mission - Sign Up</title>' +
                '</head>' +
                '<body>' +
                '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                '<div style = "background:#000;">' +
                '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                '</div>' +
                '<hr style="border:1px solid #000;width:500px">' +
                '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                '<h3>Welcome to Flux Mission!</h3>' +
                '<p>Hello "' + username + '", thank you for joining us! </p>' +
                '<p>Your email verification code is "' + email_verify + '"</p>' +
                '</div>' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                '</div>' +
                '<hr style="border:1px solid #000;width:600px">' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                'Kind Regards,<br>' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                'Flux Mission</div>' +
                '</div>' +
                '</div>' +
                '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                '<div class="yj6qo"></div><div class="adL"></div>' +
                '</div></div>' +
                '</body>' +
                '</html>',
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                //console.log(error);
				           res.json(err);
              } else {
                //console.log('Email sent: ' + info.response);
				res.json({
				  status: 1,
				  err:true,
				  message: 'Signup Successfully',
				  data: jsonObj
				});
              }
            });
            //--------------------------email send end-------------------------------//

            res.json({
              status: 1,
              message: 'Signup Successfully',
              data: jsonObj
            });
          } else {
            res.json(err);
          }
        });
      }
    } else {
      json.res(error)
    }
  });

});

// User Profile

app.post('/myprofile', function (req, res) {
  var userId = req.body.userId;
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  if (userId == "") {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.',
    });
  } else {
    con.query('select * from users where id = "' + userId + '"', function (error, selectedRows, fields) {
      if (selectedRows.length > 0) {
        let userId = selectedRows[0].id;
        var jsonObj = ({
          userId: selectedRows[0].id,
          username: selectedRows[0].username,
          firstname: selectedRows[0].firstname,
          lastname: selectedRows[0].lastname,
          email: selectedRows[0].email,
          phone: selectedRows[0].phone,
          image: user_image_url + selectedRows[0].image,
          time_zone: selectedRows[0].time_zone,
          currency: selectedRows[0].currency,
          notification_mystuff: selectedRows[0].notification_mystuff,
          notification_mymission: selectedRows[0].notification_mymission,
          notification_myprofile: selectedRows[0].notification_myprofile,
          notification_joinmission: selectedRows[0].notification_joinmission
        });
        res.json({
          status: 1,
          message: 'My Profile',
          data: jsonObj
        });
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    });
  }
});

// Update User Profile API

app.post('/updateprofile', function (req, res) {
  var userID = req.body.userId;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = firstname + ' ' + lastname;
  if (req.body.phone != '') {
    var phone = req.body.phone;
  } else {
    var phone = '';
  }
  var time_zone = req.body.time_zone;
  var currency = req.body.currency;
  var notification_mystuff = req.body.notification_mystuff;
  var notification_mymission = req.body.notification_mymission;
  var notification_myprofile = req.body.notification_myprofile;
  var notification_joinmission = req.body.notification_joinmission;
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  if (userID != '') {
    con.query('SELECT * FROM users WHERE id ="' + userID + '"', function (getError, getDetail) {
      if (getError) {
        res.json({
          status: 0,
          message: 'Error while fetching user details'
        })
      } else if (getDetail.length > 0) {
        if (getDetail[0].status == 1) {
          con.query('UPDATE users SET username = "' + username + '", firstname = "' + firstname + '", lastname = "' + lastname + '", phone = "' + phone + '", time_zone = "' + time_zone + '", currency = "' + currency + '", notification_mystuff = "' + notification_mystuff + '", notification_mymission = "' + notification_mymission + '", notification_myprofile = "' + notification_myprofile + '", notification_joinmission = "' + notification_joinmission + '", deviceName = "' + deviceName + '", deviceToken = "' + deviceToken + '" WHERE id = "' + userID + '"', function (updateError, updateRow) {
            if (updateError) {
              res.json({
                status: 0,
                message: 'Error while updating user profile'
              })
            } else {
              con.query('select * from users where id = "' + userID + '"', function (error, selectedRows, fields) {
                if (selectedRows.length > 0) {
                  let userId = selectedRows[0].id;
                  var jsonObj = ({
                    userId: selectedRows[0].id,
                    username: selectedRows[0].username,
                    firstname: selectedRows[0].firstname,
                    lastname: selectedRows[0].lastname,
                    email: selectedRows[0].email,
                    phone: selectedRows[0].phone,
                    image: user_image_url + selectedRows[0].image,
                    time_zone: selectedRows[0].time_zone,
                    currency: selectedRows[0].currency,
                    notification_mystuff: selectedRows[0].notification_mystuff,
                    notification_mymission: selectedRows[0].notification_mymission,
                    notification_myprofile: selectedRows[0].notification_myprofile,
                    notification_joinmission: selectedRows[0].notification_joinmission
                  });
                  res.json({
                    status: 1,
                    message: 'You have successfully update profile',
                    data: jsonObj
                  });
                } else {
                  res.json({
                    status: 0,
                    message: 'Your account temporarily deactivated',
                    data: []
                  });
                }
              });
            }
          })
        } else {
          res.json({
            status: 0,
            message: 'Your account temporarily deactivated',
          })
        }
      } else {
        res.json({
          status: 0,
          message: "Sorry, We can't find an account with this user id. Please try again."
        })
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.'
    })
  }
});

// Update User Profile image API
app.post('/profileImage', upload.single('file'), function (req, res, next) {
  var userID = req.body.userId;
  if ((!req.file) || (!userID)) {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.',
    });
  } else {
    var image = req.file.filename;
    con.query('UPDATE users SET image = "' + image + '" WHERE id = "' + userID + '"', function (updateError, updateRow) {
      if (updateError) {
        res.json({
          status: 0,
          message: 'Error while updating user image'
        })
      } else {
        con.query('select * from users where id = "' + userID + '"', function (error, selectedRows, fields) {
          if (selectedRows.length > 0) {
            let userId = selectedRows[0].id;
            var jsonObj = ({
              userId: selectedRows[0].id,
              username: selectedRows[0].username,
              firstname: selectedRows[0].firstname,
              lastname: selectedRows[0].lastname,
              email: selectedRows[0].email,
              phone: selectedRows[0].phone,
              image: user_image_url + selectedRows[0].image,
              time_zone: selectedRows[0].time_zone,
              currency: selectedRows[0].currency,
              notification_mystuff: selectedRows[0].notification_mystuff,
              notification_mymission: selectedRows[0].notification_mymission,
              notification_myprofile: selectedRows[0].notification_myprofile
            });
            res.json({
              status: 1,
              message: 'You have successfully update profile image',
              data: jsonObj
            });
          } else {
            res.json({
              status: 0,
              message: 'Your account temporarily deactivated',
              data: []
            });
          }
        });
      }
    })
  }
})

// Change Password API
app.post('/changepassword', function (req, res) {
  var userID = req.body.userId;
  var password = req.body.password;
  var newpassword = bcrypt.hashSync(password, 10);
  if (userID != '') {
    con.query('SELECT * FROM users WHERE id ="' + userID + '"', function (getError, getDetail) {
      if (getError) {
        res.json({
          status: 0,
          message: 'Error while fetching user details'
        })
      } else if (getDetail.length > 0) {
        if (getDetail[0].status == 1) {
          con.query('UPDATE users SET password = "' + newpassword + '" WHERE id ="' + userID + '"', function (updateError, updateRow) {
            if (updateError) {
              res.json({
                status: 0,
                message: 'Error while updating user password'
              })
            } else {
              res.json({
                status: 1,
                message: 'You have successfully update password'
              })
            }
          })
        } else {
          res.json({
            status: 0,
            message: 'Your account temporarily deactivated',
          })
        }
      } else {
        res.json({
          status: 0,
          message: "Sorry, We can't find an account with this user id. Please try again."
        })
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.'
    })
  }
});
// Forgot Password API
app.post('/forgotpassword', function (req, res) {
  let userEmail = req.body.email
  if (userEmail) {
    con.query('SELECT * FROM users WHERE email ="' + userEmail + '"', function (getError, getDetail) {
      if (getError) {
        res.json({
          status: 0,
          message: 'Error while fetching user details'
        })
      } else if (getDetail.length > 0) {
        if (getDetail[0].status == 1) {
          let otp = Math.floor(1000 + Math.random() * 9000);

          con.query('UPDATE users SET otp = "' + otp + '" WHERE email = "' + userEmail + '"', function (updateError, updateRow) {
            if (updateError) {
              res.json({
                status: 0,
                message: 'Error while updating user otp'
              })
            } else {

              //----------------------email send start---------------------------//
              var nodemailer = require('nodemailer');
              var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                // // secure: true,
                auth: {
                  user: 'noreplyfluxmission@gmail.com',
                  pass: 'Include!23'
                }
              });
              var mailOptions = {
                from: 'noreplyfluxmission@gmail.com',
                to: userEmail,
                subject: 'Flux Mission - Reset Your Password',
                html: '<!DOCTYPE html>' +
                  '<html>' +
                  '<head>' +
                  '<title>Flux Mission - Reset Your Password</title>' +
                  '</head>' +
                  '<body>' +
                  '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                  '<div style = "background:#000;">' +
                  '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                  '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                  '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                  '</div>' +
                  '<hr style="border:1px solid #000;width:500px">' +
                  '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                  '<p>Your OTP for Forget Password is ' + otp + ' </p>' +
                  '</div>' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                  'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                  '</div>' +
                  '<hr style="border:1px solid #000;width:600px">' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                  'Kind Regards,<br>' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                  'Flux Mission</div>' +
                  '</div>' +
                  '</div>' +
                  '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                  '<div class="yj6qo"></div><div class="adL"></div>' +
                  '</div></div>' +
                  '</body>' +
                  '</html>',
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  //console.log(error);
                } else {
                  //console.log('Email sent: ' + info.response);
                }
              });
              //--------------------------email send end-------------------------------//
              res.json({
                status: 1,
                message: 'OTP send successfully',
                otp: otp
              })
            }

          })
        } else {
          res.json({
            status: 0,
            message: 'Your account temporarily deactivated',
          })
        }
      } else {
        res.json({
          status: 0,
          message: "Sorry, We can't find an account with this email address. Please try again."
        })
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.'
    })
  }
});

// Reset Password API
app.post('/resetpassword', function (req, res) {
  var email = req.body.email;
  var otp = req.body.otp;
  var password = req.body.password;
  let newpassword = bcrypt.hashSync(password, 10);
  con.query('select * from users where email = "' + email + '" AND otp ="' + otp + '"', function (error, rows, fields) {
    if (rows.length > 0) {
      con.query('UPDATE users SET password = "' + newpassword + '" where email = "' + email + '"', (errorUpdate, rowsUpdate, fields) => {
        var jsonObj = ({
          email: email,
        });
        res.json({
          status: 1,
          message: 'Password Updated Successfully',
          data: jsonObj
        });
      })
    }
    else {
      var jsonObj = ({
        email: "",
      });
      res.json({
        status: 0,
        message: 'User Does Not Exist',
        data: jsonObj
      });
    }
  })
});

// User Verify Email API
app.post('/userverifyemail', function (req, res) {
  let userEmail = req.body.email
  if (userEmail) {
    con.query('SELECT * FROM users WHERE email ="' + userEmail + '"', function (getError, getDetail) {
      if (getError) {
        res.json({
          status: 0,
          message: 'Error while fetching user details'
        })
      } else if (getDetail.length > 0) {
        if (getDetail[0].status == 1) {
          let otp = Math.floor(1000 + Math.random() * 9000);

          con.query('UPDATE users SET email_verify = "' + otp + '" WHERE email = "' + userEmail + '"', function (updateError, updateRow) {
            if (updateError) {
              res.json({
                status: 0,
                message: 'Error while updating user email verification code'
              })
            } else {

              //----------------------email send start---------------------------//
              var nodemailer = require('nodemailer');
              var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                // // secure: true,
                auth: {
                  user: 'noreplyfluxmission@gmail.com',
                  pass: 'Include!23'
                }
              });
              var mailOptions = {
                from: 'noreplyfluxmission@gmail.com',
                to: userEmail,
                subject: 'Flux Mission - Email verification code',
                html: '<!DOCTYPE html>' +
                  '<html>' +
                  '<head>' +
                  '<title>Flux Mission - Email verification code</title>' +
                  '</head>' +
                  '<body>' +
                  '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                  '<div style = "background:#000;">' +
                  '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                  '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                  '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                  '</div>' +
                  '<hr style="border:1px solid #000;width:500px">' +
                  '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                  '<p>Your email verification code is ' + otp + ' </p>' +
                  '</div>' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                  'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                  '</div>' +
                  '<hr style="border:1px solid #000;width:600px">' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                  'Kind Regards,<br>' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                  'Flux Mission</div>' +
                  '</div>' +
                  '</div>' +
                  '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                  '<div class="yj6qo"></div><div class="adL"></div>' +
                  '</div></div>' +
                  '</body>' +
                  '</html>',
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  //console.log(error);
                } else {
                  //console.log('Email sent: ' + info.response);
                }
              });
              //--------------------------email send end-------------------------------//
              res.json({
                status: 1,
                message: 'OTP send successfully',
                otp: otp
              })
            }

          })
        } else {
          res.json({
            status: 0,
            message: 'Your account temporarily deactivated',
          })
        }
      } else {
        res.json({
          status: 0,
          message: "Sorry, We can't find an account with this email address. Please try again."
        })
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.'
    })
  }
});

// Verify Email Address
app.post('/verifyemail', function (req, res) {
  let email = req.body.email;
  let otp = req.body.otp;
  let deviceName = req.body.deviceName;
  let deviceToken = req.body.deviceToken;
  let emailverify = '0';
  if ((email != '') && (otp != '')) {
    con.query('select * from users where email = "' + email + '" AND email_verify ="' + otp + '"', function (error, rows1, fields1) {
      if (rows1.length > 0) {
        con.query('select * from users where email = "' + email + '"', function (customerError, customerRows, fields) {
          if (!error) {
            if (customerRows.length > 0) {
              con.query('UPDATE users SET deviceToken = "' + deviceToken + '", deviceName = "' + deviceName + '", email_verify = "' + emailverify + '" WHERE  email = "' + email + '"', (errorUpdating, rows, fields) => {
                if (!errorUpdating) {
                  let userId = customerRows[0].id;
                  var jsonObj = ({
                    userId: customerRows[0].id,
                    username: customerRows[0].username,
                    firstname: customerRows[0].firstname,
                    lastname: customerRows[0].lastname,
                    email: customerRows[0].email,
                    phone: customerRows[0].phone
                  });
                  res.json({
                    status: 1,
                    message: 'Login Successfully',
                    data: jsonObj
                  });
                }
                else {
                  res.json(errorUpdating)
                }
              });
            } else {
              res.json({
                status: 0,
                message: 'Incorrect email',
                data: []
              });
            }
          } else {
            json.res(error)
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'User Does Not Exist',
          data: []
        });
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'User email & otp required'
    })
  }
});
// Logout API
app.post('/logout', function (req, res) {
  let userId = req.body.userId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if (userId) {
    con.query('SELECT * FROM users WHERE id =' + userId, function (getUserError, getUserRow) {
      if (getUserError) {
        res.json({
          status: 0,
          message: 'Error while fetching user details'
        })
      } else if (getUserRow.length > 0) {
        con.query('UPDATE users SET deviceToken = "' + deviceToken + '", deviceName = "' + deviceName + '" WHERE id = ' + userId, function (updateError, updateRow) {
          if (updateError) {
            res.json({
              status: 0,
              message: 'Error while updating user deviceToken'
            })
          } else {
            res.json({
              status: 1,
              message: 'Logout Successfully'
            })
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'No user found with the given id'
        })
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'User id is required'
    })
  }
});
//============================================================Mission=================================================================
// Mission List
app.post('/missionlist', function (req, res) {
  let userId = req.body.userId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if ((deviceToken != '') && (deviceName != '')) {
    //let missionDetailArray = [];
    con.query('SELECT * FROM mission WHERE status = 1 ORDER BY id DESC', function (error, rows, fields) {
      if (rows.length > 0) {
        let missionDetailArray = [];
        async.eachSeries(rows, function iteratee(row, callback) {
          con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + row.id + '"', function (merror, selectedRows, mfields) {
            if (selectedRows.length > 0) {
              if (userId == selectedRows[0].user_id) {
                var getDistance = [];
                if (row.targetDistance != '') {
                  getDistance = JSON.parse(row.targetDistance);
                  getDistance = JSON.parse(getDistance);
                }
                missionDetailArray.push({
                  missionId: row.id,
                  name: row.name,
                  categoryName: row.categoryName,
                  shortDescription: row.sortDescription,
                  description: row.description,
                  image: base_url + row.image,
                  award: row.award,
                  awardDescription: row.awardDescription,
                  awardImage: base_url + row.awardImage,
                  //targetDistance: row.targetDistance,
                  userTargetDistance: selectedRows[0].userTargetDistance,
                  targetDistance: getDistance,
                  targetDistanceFormat: row.targetDistanceFormat,
                  timeReport: row.timeReport,
                  timeReportFormat: row.timeReportFormat,
                  membership_prize: row.membership_prize,
                  join_status: '1',
                });
              }
            } else {
              var getDistance = [];
              if (row.targetDistance != '') {
                getDistance = JSON.parse(row.targetDistance);
                getDistance = JSON.parse(getDistance);
              }
              missionDetailArray.push({
                missionId: row.id,
                name: row.name,
                categoryName: row.categoryName,
                shortDescription: row.sortDescription,
                description: row.description,
                image: base_url + row.image,
                award: row.award,
                awardDescription: row.awardDescription,
                awardImage: base_url + row.awardImage,
                //targetDistance: row.targetDistance,
                userTargetDistance: '',
                targetDistance: getDistance,
                targetDistanceFormat: row.targetDistanceFormat,
                timeReport: row.timeReport,
                timeReportFormat: row.timeReportFormat,
                 membership_prize: row.membership_prize,
                join_status: '0',
              });
            }
            callback();
          })
        }, function done() {
          res.json({
            status: 1,
            message: 'Missions List',
            data: missionDetailArray
          });
        })

      } else {
        res.json({
          status: 0,
          message: 'No mission Available',
          data: []
        });
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'User id is required'
    })
  }
});

// Mission Detail
app.post('/mission', function (req, res) {
  let userId = req.body.userId;
  let missionId = req.body.missionId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if ((missionId != '') && (deviceToken != '') && (deviceName != '')) {
    let missionDetailArray = [];
    con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + missionId + '"', function (error, row, fields) {
      if (row.length > 0) {
        con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + row[0].id + '"', function (merror, selectedRows, mfields) {
          if (selectedRows.length > 0) {
            if (userId == selectedRows[0].user_id) {

              var getDistance = [];
              if (row[0].targetDistance != '') {
                getDistance = JSON.parse(row[0].targetDistance);
                getDistance = JSON.parse(getDistance);
              }

              missionDetailArray.push({
                missionId: row[0].id,
                name: row[0].name,
                categoryName: row[0].categoryName,
                shortDescription: row[0].sortDescription,
                description: row[0].description,
                image: base_url + row[0].image,
                award: row[0].award,
                awardDescription: row[0].awardDescription,
                awardImage: base_url + row[0].awardImage,
                //targetDistance: row[0].targetDistance,
                userTargetDistance: selectedRows[0].userTargetDistance,
                targetDistance: getDistance,
                targetDistanceFormat: row[0].targetDistanceFormat,
                timeReport: row[0].timeReport,
                timeReportFormat: row[0].timeReportFormat,
                join_status: '1',
              });
            }
          } else {
            var getDistance = [];
            if (row[0].targetDistance != '') {
              getDistance = JSON.parse(row[0].targetDistance);
              getDistance = JSON.parse(getDistance);
            }

            missionDetailArray.push({
              missionId: row[0].id,
              name: row[0].name,
              categoryName: row[0].categoryName,
              shortDescription: row[0].sortDescription,
              description: row[0].description,
              image: base_url + row[0].image,
              award: row[0].award,
              awardDescription: row[0].awardDescription,
              awardImage: base_url + row[0].awardImage,
              //targetDistance: row[0].targetDistance,
              userTargetDistance: '',
              targetDistance: getDistance,
              targetDistanceFormat: row[0].targetDistanceFormat,
              timeReport: row[0].timeReport,
              timeReportFormat: row[0].timeReportFormat,
              join_status: '0',
            });
          }
          res.json({
            status: 1,
            message: 'Mission Details',
            data: missionDetailArray
          })
        })
      } else {
        res.json({
          status: 0,
          message: 'No mission Available',
          data: []
        });
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'Mission id is required'
    })
  }
});

// Join Mission API
app.post('/joinmission', function (req, res) {
  var userId = req.body.userId;
  var userEmail = req.body.userEmail;
  var missionId = req.body.missionId;
  var mission_end_time = req.body.mission_end_time;
  var userTargetDistance = req.body.userTargetDistance;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (error, selectedRows, fields) {
    if (selectedRows.length > 0) {
      if (missionId == selectedRows[0].mission_id) {
        res.json({
          status: 0,
          message: 'Mission Already Exist',
        });
      }
    } else {
      var status = 'Pending';
      var mission_distance = '0 KM';
      var mission_time = '0';
      var activity = ' ';
      var addCommunity = 'No';
      var like_status = '0';
      con.query('INSERT INTO user_mission(`user_id`,`mission_id`,`status`,`mission_distance`,`mission_time`,`mission_end_time`,`userTargetDistance`,`activity`,`addCommunity`,`like_status`,`deviceName`,`deviceToken`) VALUES ("' + userId + '","' + missionId + '","' + status + '","' + mission_distance + '","' + mission_time + '","' + mission_end_time + '","' + userTargetDistance + '","' + activity + '","' + addCommunity + '","' + like_status + '","' + deviceName + '","' + deviceToken + '")', function (err, results, fields) {
        if (!err) {
          let missionDetailArray = [];
          con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + missionId + '"', function (error, row, fields) {
            if (row.length > 0) {
              var getDistance = [];
              if (row[0].targetDistance != '') {
                getDistance = JSON.parse(row[0].targetDistance);
                getDistance = JSON.parse(getDistance);
              }

              missionDetailArray.push({
                missionId: row[0].id,
                name: row[0].name,
                categoryName: row[0].categoryName,
                shortDescription: row[0].sortDescription,
                description: row[0].description,
                image: base_url + row[0].image,
                status: status,
                mission_distance: mission_distance,
                mission_time: mission_time,
                mission_end_time: mission_end_time,
                activity: activity,
                addCommunity: addCommunity,
                like_status: like_status,
                award: row[0].award,
                awardDescription: row[0].awardDescription,
                awardImage: base_url + row[0].awardImage,
                userTargetDistance: userTargetDistance,
                //targetDistance: row[0].targetDistance,
                targetDistance: getDistance,
                targetDistanceFormat: row[0].targetDistanceFormat,
                timeReport: row[0].timeReport,
                timeReportFormat: row[0].timeReportFormat,
              });

              //----------------------email send start---------------------------//
              var nodemailer = require('nodemailer');
              var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                // // secure: true,
                auth: {
                  user: 'noreplyfluxmission@gmail.com',
                  pass: 'Include!23'
                }
              });
              var mailOptions = {
                from: 'noreplyfluxmission@gmail.com',
                to: userEmail,
                subject: 'Flux Mission - Join Mission',
                html: '<!DOCTYPE html>' +
                  '<html>' +
                  '<head>' +
                  '<title>Flux Mission - Join Mission</title>' +
                  '</head>' +
                  '<body>' +
                  '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                  '<div style = "background:#000;">' +
                  '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                  '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                  '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                  '</div>' +
                  '<hr style="border:1px solid #000;width:500px">' +
                  '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                  '<p>Congratulations, you have join the mission "' + row[0].name + '" </p>' +
                  '</div>' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                  'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                  '</div>' +
                  '<hr style="border:1px solid #000;width:600px">' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                  'Kind Regards,<br>' +
                  '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                  'Flux Mission</div>' +
                  '</div>' +
                  '</div>' +
                  '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                  '<div class="yj6qo"></div><div class="adL"></div>' +
                  '</div></div>' +
                  '</body>' +
                  '</html>',
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  //console.log(error);
                } else {
                  //console.log('Email sent: ' + info.response);
                }
              });
              //--------------------------email send end-------------------------------//
              res.json({
                status: 1,
                message: 'Join Mission Successfully',
                data: missionDetailArray
              })
            } else {
              res.json(error);
            }
          })
        } else {
          res.json(err);
        }
      });
    }
  });
});

// My Mission List 
app.post('/mymissionlist', function (req, res) {
  var userId = req.body.userId;
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  let productDetailArray = [];
  if (userId == "") {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.',
    });
  } else {
    con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" ORDER BY id DESC', function (error, rows, fields) {
      if (rows.length > 0) {
        let missionsArray = [];
        async.eachSeries(rows, function iteratee(row, callback) {
          let activityArray = [];
          con.query('SELECT * FROM user_activity WHERE user_id = "' + userId + '" AND mission_id = "' + row.mission_id + '" ORDER BY id DESC', function (aerror, arows, afields) {
            if (arows.length > 0) {
              for (var count = 0; count < arows.length; count++) {
                activityArray.push({
                  "activityId": arows[count].id,
                  "distance": arows[count].mission_distance,
                  "last_distance": arows[count].last_distance,
                  "distance_type": arows[count].distance_type,
                  "mission_time": arows[count].mission_time,
                  "last_time": arows[count].last_time,
                  "activity": arows[count].activity,
                  "community": arows[count].addCommunity,
                  "remark": arows[count].remark,
                  "like_status": arows[count].like_status,
                });
              }
            }
            con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + row.mission_id + '"', function (missionError, missionrow, missionfields) {
              if (missionrow.length > 0) {
                missionsArray.push({
                  missionId: missionrow[0].id,
                  name: missionrow[0].name,
                  categoryName: missionrow[0].categoryName,
                  shortDescription: missionrow[0].sortDescription,
                  description: missionrow[0].description,
                  image: base_url + missionrow[0].image,
                  status: row.status,
                  mission_distance: row.mission_distance,
                  mission_time: row.mission_time,
                  mission_end_time: row.mission_end_time,
                  activity: row.activity,
                  addCommunity: row.addCommunity,
                  like_status: row.like_status,
                  award: missionrow[0].award,
                  awardDescription: missionrow[0].awardDescription,
                  awardImage: base_url + missionrow[0].awardImage,
                  userTargetDistance: row.userTargetDistance,
                  targetDistance: missionrow[0].targetDistance,
                  targetDistanceFormat: missionrow[0].targetDistanceFormat,
                  timeReport: missionrow[0].timeReport,
                  timeReportFormat: missionrow[0].timeReportFormat,
                  activityList: activityArray,
                  create_date: row.create_date,
                  membership_prize:row.membership_prize
                })
              }
              callback();
            })
          })
        }, function done() {
          res.json({
            status: 1,
            message: 'My Missions List',
            data: missionsArray
          });
        })
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    });
  }
});

// Complete Mission
app.post('/completemission', function (req, res) {
  var userId = req.body.userId;
  var userEmail = req.body.userEmail;
  var missionId = req.body.missionId;
  var status = req.body.status;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (error, selectedRows, fields) {
    if (selectedRows.length > 0) {
      if (missionId == selectedRows[0].mission_id) {
        con.query('UPDATE user_mission SET status = "' + status + '" WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (updateError, updateRow) {
          if (updateError) {
            res.json({
              status: 0,
              message: 'Error while updating mission status'
            })
          } else {
            let missionDetailArray = [];
            con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + missionId + '"', function (missionerror, row, mfields) {
              if (row.length > 0) {
                missionDetailArray.push({
                  missionId: row[0].id,
                  name: row[0].name,
                  categoryName: row[0].categoryName,
                  shortDescription: row[0].sortDescription,
                  description: row[0].description,
                  image: base_url + row[0].image,
                  status: status,
                  mission_distance: selectedRows[0].mission_distance,
                  mission_time: selectedRows[0].mission_time,
                  mission_end_time: selectedRows[0].mission_end_time,
                  activity: selectedRows[0].activity,
                  addCommunity: selectedRows[0].addCommunity,
                  like_status: selectedRows[0].like_status,
                  award: row[0].award,
                  awardDescription: row[0].awardDescription,
                  awardImage: base_url + row[0].awardImage,
                  userTargetDistance: selectedRows[0].userTargetDistance,
                  targetDistance: row[0].targetDistance,
                  targetDistanceFormat: row[0].targetDistanceFormat,
                  timeReport: row[0].timeReport,
                  timeReportFormat: row[0].timeReportFormat,
                });

                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: userEmail,
                  subject: 'Flux Mission - Mission Complete',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission - Mission Complete</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Congratulations, you have completed the mission "' + row[0].name + '" </p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };

                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
                res.json({
                  status: 1,
                  message: 'Mission Complete Successfully',
                  data: missionDetailArray
                })
              } else {
                res.json(missionerror);
              }
            })
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'Mission Not Exist',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No mission Available',
        data: []
      });
    }
  });
});

// Add Progress
app.post('/addprogress', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var activity = req.body.activity;
  var mission_distance = req.body.mission_distance;
  var mission_time = req.body.mission_time;
  var addCommunity = req.body.addCommunity;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (error, selectedRows, fields) {
    if (selectedRows.length > 0) {
      if (missionId == selectedRows[0].mission_id) {
        con.query('UPDATE user_mission SET mission_distance = "' + mission_distance + '", mission_time = "' + mission_time + '", activity = "' + activity + '", addCommunity = "' + addCommunity + '" WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (updateError, updateRow) {
          if (updateError) {
            res.json({
              status: 0,
              message: 'Error while updating mission progress'
            })
          } else {
            let missionDetailArray = [];
            con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + missionId + '"', function (missionerror, row, mfields) {
              if (row.length > 0) {
                missionDetailArray.push({
                  missionId: row[0].id,
                  name: row[0].name,
                  categoryName: row[0].categoryName,
                  shortDescription: row[0].sortDescription,
                  description: row[0].description,
                  image: base_url + row[0].image,
                  status: selectedRows[0].status,
                  mission_distance: mission_distance,
                  mission_time: mission_time,
                  mission_end_time: selectedRows[0].mission_end_time,
                  activity: activity,
                  addCommunity: addCommunity,
                  like_status: selectedRows[0].like_status,
                  award: row[0].award,
                  awardDescription: row[0].awardDescription,
                  awardImage: base_url + row[0].awardImage,
                  userTargetDistance: selectedRows[0].userTargetDistance,
                  targetDistance: row[0].targetDistance,
                  targetDistanceFormat: row[0].targetDistanceFormat,
                  timeReport: row[0].timeReport,
                  timeReportFormat: row[0].timeReportFormat,
                });
                res.json({
                  status: 1,
                  message: 'Progress Add Successfully',
                  data: missionDetailArray
                })
              } else {
                res.json(missionerror);
              }
            })
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'Mission Not Exist',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No mission Available',
        data: []
      });
    }
  });
});

// Add Activity
app.post('/addactivity', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var activity = req.body.activity;
  var mission_distance = req.body.mission_distance;
  var last_distance = req.body.last_distance;
  var distance_type = req.body.distance_type;
  var mission_time = req.body.mission_time;
  var last_time = req.body.last_time;
  var addCommunity = req.body.addCommunity;
  var remark = req.body.remark;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (error, selectedRows, fields) {
    if (selectedRows.length > 0) {
      if (missionId == selectedRows[0].mission_id) {
        con.query('UPDATE user_mission SET mission_distance = "' + mission_distance + '", mission_time = "' + mission_time + '", activity = "' + activity + '", addCommunity = "' + addCommunity + '" WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (updateError, updateRow) {
          if (updateError) {
            res.json({
              status: 0,
              message: 'Error while updating mission progress'
            })
          } else {
            let missionDetailArray = [];
            let like_status = '0';
            con.query('INSERT INTO user_activity(`user_id`,`mission_id`,`mission_distance`,`last_distance`,`distance_type`,`mission_time`,`last_time`,`activity`,`addCommunity`,`remark`,`like_status`,`deviceName`,`deviceToken`) VALUES ("' + userId + '","' + missionId + '","' + mission_distance + '","' + last_distance + '","' + distance_type + '","' + mission_time + '","' + last_time + '","' + activity + '","' + addCommunity + '","' + remark + '","' + like_status + '","' + deviceName + '","' + deviceToken + '")', function (activityError, activityResult, activityFields) {
              if (!activityError) {
                let activityArray = [];
                con.query('SELECT * FROM user_activity WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" ORDER BY id DESC', function (aerror, arows, afields) {
                  if (arows.length > 0) {
                    for (var count = 0; count < arows.length; count++) {
                      activityArray.push({
                        "activityId": arows[count].id,
                        "distance": arows[count].mission_distance,
                        "last_distance": arows[count].last_distance,
                        "distance_type": arows[count].distance_type,
                        "mission_time": arows[count].mission_time,
                        "last_time": arows[count].last_time,
                        "activity": arows[count].activity,
                        "community": arows[count].addCommunity,
                        "remark": arows[count].remark,
                        "like_status": arows[count].like_status,
                      });
                    }
                    con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + missionId + '"', function (missionerror, row, mfields) {
                      if (row.length > 0) {
                        missionDetailArray.push({
                          missionId: row[0].id,
                          name: row[0].name,
                          categoryName: row[0].categoryName,
                          shortDescription: row[0].sortDescription,
                          description: row[0].description,
                          image: base_url + row[0].image,
                          status: selectedRows[0].status,
                          mission_distance: mission_distance,
                          mission_time: mission_time,
                          mission_end_time: selectedRows[0].mission_end_time,
                          activity: activity,
                          addCommunity: addCommunity,
                          like_status: selectedRows[0].like_status,
                          award: row[0].award,
                          awardDescription: row[0].awardDescription,
                          awardImage: base_url + row[0].awardImage,
                          userTargetDistance: selectedRows[0].userTargetDistance,
                          targetDistance: row[0].targetDistance,
                          targetDistanceFormat: row[0].targetDistanceFormat,
                          timeReport: row[0].timeReport,
                          timeReportFormat: row[0].timeReportFormat,
                          activityList: activityArray
                        });
                        res.json({
                          status: 1,
                          message: 'Activity Add Successfully',
                          data: missionDetailArray
                        })
                      } else {
                        res.json(missionerror);
                      }
                    })
                  } else {
                    res.json({
                      status: 0,
                      message: 'No Record Found',
                      data: []
                    });
                  }
                });
              } else {
                res.json(activityError);
              }
            });
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'Mission Not Exist',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No mission Available',
        data: []
      });
    }
  });
});

// Mission Activity List
app.post('/missionactivitylist', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  let productDetailArray = [];
  if (userId == "") {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.',
    });
  } else {
    con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" ORDER BY id DESC', function (error, rows, fields) {
      if (rows.length > 0) {
        let activityArray = [];
        con.query('SELECT * FROM user_activity WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" ORDER BY id DESC', function (aerror, arows, afields) {
          if (arows.length > 0) {
            for (var count = 0; count < arows.length; count++) {
              activityArray.push({
                "activityId": arows[count].id,
                "distance": arows[count].mission_distance,
                "last_distance": arows[count].last_distance,
                "distance_type": arows[count].distance_type,
                "mission_time": arows[count].mission_time,
                "last_time": arows[count].last_time,
                "activity": arows[count].activity,
                "community": arows[count].addCommunity,
                "remark": arows[count].remark,
                "like_status": arows[count].like_status,
              });
            }
          }
          res.json({
            status: 1,
            message: 'My Mission Activity List',
            data: activityArray
          });
        })
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    });
  }
});

// Activity List
app.post('/activitylist2', function (req, res) {
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if ((deviceToken != '') && (deviceName != '')) {
    let activityArray = [];
    con.query('SELECT * FROM categories WHERE status = 1 ORDER BY position ASC', function (error, rows, fields) {
      if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
          activityArray.push({
            lable: rows[i].name,
            value: rows[i].nameUrl
          });
        }
        res.json({
          status: 1,
          test  :'update to hua h',
          message: 'Activity List',
          data: activityArray
        })
      } else {
        res.json({
          status: 0,
          message: 'No Activity Available',
          data: []
        });
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'No Activity Available'
    })
  }
});


app.post('/activitylist', function (req, res) {
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if ((deviceToken != '') && (deviceName != '')) {
    let activityArray = [];
    con.query('SELECT * FROM categories WHERE status = 1 ORDER BY position ASC', function (error, rows, fields) {
      if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
          activityArray.push({
            lable: rows[i].name,
            value: rows[i].nameUrl
          });
        }
        res.json({
          status: 1,
          test  :'update to hua h',
          message: 'Activity List',
          data: activityArray
        })
      } else {
        res.json({
          status: 0,
          message: 'No Activity Available',
          data: []
        });
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'No Activity Available'
    })
  }
});
// Time Report List
app.post('/timereportlist', function (req, res) {
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if ((deviceToken != '') && (deviceName != '')) {
    let timereportArray = [];
    con.query('SELECT * FROM timereport WHERE status = 1 ORDER BY id DESC', function (error, rows, fields) {
      if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
          timereportArray.push({
            key: rows[i].time_value,
            value: rows[i].time_key
          });
        }
        res.json({
          status: 1,
          message: 'Time Report List',
          data: timereportArray
        })
      } else {
        res.json({
          status: 0,
          message: 'No Time Report Available',
          data: []
        });
      }
    })
  } else {
    res.json({
      status: 0,
      message: 'No Time Report Available'
    })
  }
});

// Add User Follow
app.post('/addfollow', function (req, res) {
  let userId = req.body.userId;
  let missionId = req.body.missionId;
  let followingUserId = req.body.following_userId;
  let status = req.body.status;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  let username = req.body.username;
  let lsm = '';
  if (status == '1') {
    lsm = 'follow';
  } else {
    lsm = 'unfollow';
  }
  con.query('SELECT * FROM user_follow WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" AND following_userId = "' + followingUserId + '"', function (error, rows, fields) {
    if (rows.length > 0) {
      con.query('UPDATE user_follow SET status = "' + status + '" WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" AND following_userId = "' + followingUserId + '"', function (updateError, updateRow) {
        if (updateError) {
          res.json({
            status: 0,
            message: 'Error while updating user follow',
            data: []
          })
        } else {
          con.query('select * from users where id = "' + followingUserId + '"', function (error, selectedRows, fields) {
            if (selectedRows.length > 0) {
              if (selectedRows[0].notification_mystuff == 'Push') {
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm + " you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response); 
                  }
                });
                //---------------push notification---------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Email') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm + ' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Both') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm + ' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm + " you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response);
                  }
                });
                //---------------push notification---------------------//
              }
            }

            let followingArray = [];
            con.query('SELECT * FROM user_follow WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" ORDER BY id DESC', function (ferror, frows, ffields) {
              if (frows.length > 0) {
                async.eachSeries(frows, function iteratee(frow, callback) {
                  con.query('SELECT * FROM users WHERE id = "' + frow.following_userId + '"', function (userError, userrow, userfields) {
                    if (userrow.length > 0) {
                      followingArray.push({
                        id: userrow[0].id,
                        name: userrow[0].username,
                        image: user_image_url + userrow[0].image,
                        status: frow.status
                      })
                    }
                    callback();
                  })
                }, function done() {
                  res.json({
                    status: 1,
                    message: 'User Following List',
                    data: followingArray
                  });
                })
              } else {
                res.json({
                  status: 0,
                  message: 'No Record Found',
                  data: []
                });
              }
            });

          });
        }
      });
    } else {
      con.query('INSERT INTO user_follow(`user_id`,`mission_id`,`following_userId`,`status`,`deviceName`,`deviceToken`) VALUES ("' + userId + '","' + missionId + '","' + followingUserId + '","' + status + '","' + deviceName + '","' + deviceToken + '")', function (followError, followResult, followFields) {
        if (!followError) {
          con.query('select * from users where id = "' + followingUserId + '"', function (error, selectedRows, fields) {
            if (selectedRows.length > 0) {
              if (selectedRows[0].notification_mystuff == 'Push') {
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm + " you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response); 
                  }
                });
                //---------------push notification---------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Email') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm + ' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Both') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm + ' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm + " you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response);
                  }
                });
                //---------------push notification---------------------//
              }
            }

            let followingArray = [];
            con.query('SELECT * FROM user_follow WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" ORDER BY id DESC', function (ferror, frows, ffields) {
              if (frows.length > 0) {
                async.eachSeries(frows, function iteratee(frow, callback) {
                  con.query('SELECT * FROM users WHERE id = "' + frow.following_userId + '"', function (userError, userrow, userfields) {
                    if (userrow.length > 0) {
                      followingArray.push({
                        id: userrow[0].id,
                        name: userrow[0].username,
                        image: user_image_url + userrow[0].image,
                        status: frow.status
                      })
                    }
                    callback();
                  })
                }, function done() {
                  res.json({
                    status: 1,
                    message: 'User Following List',
                    data: followingArray
                  });
                })
              } else {
                res.json({
                  status: 0,
                  message: 'No Record Found',
                  data: []
                });
              }
            });

          });
        } else {
          res.json(followError);
        }
      })
    }
  });
});

// User - Following
app.post('/userfollowing', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_follow WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" ORDER BY id DESC', function (error, rows, fields) {
    if (rows.length > 0) {
      let newsArray = [];
      async.eachSeries(rows, function iteratee(row, callback) {
        con.query('SELECT * FROM users WHERE id = "' + row.following_userId + '"', function (userError, userrow, userfields) {
          if (userrow.length > 0) {
            if (row.status != "0") {
              newsArray.push({
                id: userrow[0].id,
                name: userrow[0].username,
                image: user_image_url + userrow[0].image,
                status: row.status,
              })
            }
          }
          callback();
        })
      }, function done() {
        res.json({
          status: 1,
          message: 'User Following List',
          data: newsArray
        });
      })
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Following Search
app.post('/searchuser', function (req, res) {
  let searchText = req.body.search;
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM users WHERE username LIKE "%' + searchText + '%" ORDER BY id DESC', function (error, rows, fields) {
    if (!error) {
      if (rows.length > 0) {
        let newsArray = [];
        async.eachSeries(rows, function iteratee(row, callback) {
          con.query('SELECT * FROM users WHERE id = "' + row.id + '"', function (userError, userrow, userfields) {
            con.query('SELECT * FROM user_follow WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" AND following_userId = "' + row.id + '"', function (ferror, frows, ffields) {
              if (frows.length > 0) {
                if (frows[0].status != "1") {
                  newsArray.push({
                    id: userrow[0].id,
                    name: userrow[0].username,
                    image: user_image_url + userrow[0].image,
                    status: frows[0].status,
                  })
                }
              } else {
                if (userrow.length > 0) {
                  newsArray.push({
                    id: userrow[0].id,
                    name: userrow[0].username,
                    image: user_image_url + userrow[0].image,
                    status: "0",
                  })
                }
              }
              callback();
            })
          })
        }, function done() {
          res.json({
            status: 1,
            message: 'Following Search List',
            data: newsArray
          });
        })
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Add User Comment
app.post('/addcomment', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var activityId = req.body.activityId;
  var comment = req.body.comment;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('INSERT INTO user_comments(`user_id`,`mission_id`,`activity_id`,`comment`,`deviceName`,`deviceToken`) VALUES ("' + userId + '","' + missionId + '","' + activityId + '","' + comment + '","' + deviceName + '","' + deviceToken + '")', function (followError, followResult, followFields) {
    if (!followError) {
      let commentArray = [];
      con.query('SELECT * FROM user_comments WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" AND activity_id = "' + activityId + '" ORDER BY id DESC', function (aerror, arows, afields) {
        if (arows.length > 0) {
          for (var count = 0; count < arows.length; count++) {
            var now = new Date(arows[count].create_date);
            commentArray.push({
              "commentId": arows[count].id,
              "comment": arows[count].comment,
              "create_date": dateFormat(now, "dd-mm-yyyy h:MM:ss TT"),
            });
          }
          res.json({
            status: 1,
            message: 'Comment Add Successfully',
            data: commentArray
          })
        } else {
          res.json({
            status: 0,
            message: 'No Record Found',
            data: []
          });
        }
      });
    } else {
      res.json(followError);
    }
  })
});

// User Comment List
app.post('/commentlist', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var activityId = req.body.activityId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  let commentArray = [];
  con.query('SELECT * FROM user_comments WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" AND activity_id = "' + activityId + '" ORDER BY id DESC', function (aerror, arows, afields) {
    if (arows.length > 0) {
      for (var count = 0; count < arows.length; count++) {
        var now = new Date(arows[count].create_date);
        commentArray.push({
          "commentId": arows[count].id,
          "comment": arows[count].comment,
          "create_date": dateFormat(now, "dd-mm-yyyy h:MM:ss TT"),
        });
      }
      res.json({
        status: 1,
        message: 'Comments List',
        data: commentArray
      })
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Mission Like / Dislike
app.post('/missionlike', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var like_status = req.body.like_status;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (error, selectedRows, fields) {
    if (selectedRows.length > 0) {
      if (missionId == selectedRows[0].mission_id) {
        con.query('UPDATE user_mission SET like_status = "' + like_status + '" WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (updateError, updateRow) {
          if (updateError) {
            res.json({
              status: 0,
              message: 'Error while updating mission like'
            })
          } else {
            let missionDetailArray = [];
            con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + missionId + '"', function (missionerror, row, mfields) {
              if (row.length > 0) {
                missionDetailArray.push({
                  missionId: row[0].id,
                  name: row[0].name,
                  categoryName: row[0].categoryName,
                  shortDescription: row[0].sortDescription,
                  description: row[0].description,
                  image: base_url + row[0].image,
                  status: selectedRows[0].status,
                  mission_distance: selectedRows[0].mission_distance,
                  mission_time: selectedRows[0].mission_time,
                  mission_end_time: selectedRows[0].mission_end_time,
                  activity: selectedRows[0].activity,
                  addCommunity: selectedRows[0].addCommunity,
                  like_status: like_status,
                  award: row[0].award,
                  awardDescription: row[0].awardDescription,
                  awardImage: base_url + row[0].awardImage,
                  userTargetDistance: selectedRows[0].userTargetDistance,
                  targetDistance: row[0].targetDistance,
                  targetDistanceFormat: row[0].targetDistanceFormat,
                  timeReport: row[0].timeReport,
                  timeReportFormat: row[0].timeReportFormat,
                });
                res.json({
                  status: 1,
                  message: 'Like Status Update Successfully',
                  data: missionDetailArray
                })
              } else {
                res.json(missionerror);
              }
            })
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'Mission Not Exist',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No mission Available',
        data: []
      });
    }
  });
});

// Add Activity Like
app.post('/addactivitylike', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var activityId = req.body.activityId;
  var like_status = req.body.like_status;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_mission WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (error, selectedRows, fields) {
    if (selectedRows.length > 0) {
      if (missionId == selectedRows[0].mission_id) {
        con.query('UPDATE user_activity SET like_status = "' + like_status + '" WHERE id = "' + activityId + '" AND user_id = "' + userId + '" AND mission_id = "' + missionId + '"', function (updateError, updateRow) {
          if (updateError) {
            res.json({
              status: 0,
              message: 'Error while updating mission activity like'
            })
          } else {
            let missionDetailArray = [];
            let activityArray = [];
            con.query('SELECT * FROM user_activity WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" ORDER BY id DESC', function (aerror, arows, afields) {
              if (arows.length > 0) {
                for (var count = 0; count < arows.length; count++) {
                  activityArray.push({
                    "activityId": arows[count].id,
                    "distance": arows[count].mission_distance,
                    "last_distance": arows[count].last_distance,
                    "distance_type": arows[count].distance_type,
                    "mission_time": arows[count].mission_time,
                    "last_time": arows[count].last_time,
                    "activity": arows[count].activity,
                    "community": arows[count].addCommunity,
                    "remark": arows[count].remark,
                    "like_status": arows[count].like_status,
                  });
                }
                con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + missionId + '"', function (missionerror, row, mfields) {
                  if (row.length > 0) {
                    missionDetailArray.push({
                      missionId: row[0].id,
                      name: row[0].name,
                      categoryName: row[0].categoryName,
                      shortDescription: row[0].sortDescription,
                      description: row[0].description,
                      image: base_url + row[0].image,
                      status: selectedRows[0].status,
                      mission_distance: selectedRows[0].mission_distance,
                      mission_time: selectedRows[0].mission_time,
                      mission_end_time: selectedRows[0].mission_end_time,
                      activity: selectedRows[0].activity,
                      addCommunity: selectedRows[0].addCommunity,
                      like_status: selectedRows[0].like_status,
                      award: row[0].award,
                      awardDescription: row[0].awardDescription,
                      awardImage: base_url + row[0].awardImage,
                      userTargetDistance: selectedRows[0].userTargetDistance,
                      targetDistance: row[0].targetDistance,
                      targetDistanceFormat: row[0].targetDistanceFormat,
                      timeReport: row[0].timeReport,
                      timeReportFormat: row[0].timeReportFormat,
                      activityList: activityArray
                    });
                    res.json({
                      status: 1,
                      message: 'Activity Like Add Successfully',
                      data: missionDetailArray
                    })
                  } else {
                    res.json(missionerror);
                  }
                })
              } else {
                res.json({
                  status: 0,
                  message: 'No Record Found',
                  data: []
                });
              }
            });
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'Mission Not Exist',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No mission Available',
        data: []
      });
    }
  });
});

// Global People List
app.post('/peoplelist', function (req, res) {
  var userId = req.body.userId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM users WHERE NOT id = "' + userId + '" ORDER BY id DESC', function (error, rows, fields) {
    if (!error) {
      if (rows.length > 0) {
        let newsArray = [];
        async.eachSeries(rows, function iteratee(row, callback) {
          con.query('SELECT * FROM global_user_follow WHERE user_id = "' + userId + '" AND following_userId = "' + row.id + '"', function (userError, userrow, userfields) {
            if (userrow.length > 0) {
              newsArray.push({
                id: row.id,
                name: row.username,
                image: user_image_url + row.image,
                status: userrow[0].status,
              })
            } else {
              newsArray.push({
                id: row.id,
                name: row.username,
                image: user_image_url + row.image,
                status: "0",
              })
            }
            callback();
          })
        }, function done() {
          res.json({
            status: 1,
            message: 'People List',
            data: newsArray
          });
        })
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Add Global User Follow
app.post('/addglobalfollow', function (req, res) {
  var userId = req.body.userId;
  var username = req.body.username;
  var followingUserId = req.body.following_userId;
  var status = req.body.status;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if (status == '1') {
    var lsm = 'follow';
  } else {
    var lsm = 'unfollow';
  }
  con.query('SELECT * FROM global_user_follow WHERE user_id = "' + userId + '" AND following_userId = "' + followingUserId + '"', function (error, rows, fields) {
    if (rows.length > 0) {
      con.query('UPDATE global_user_follow SET status = "' + status + '" WHERE user_id = "' + userId + '" AND following_userId = "' + followingUserId + '"', function (updateError, updateRow) {
        if (updateError) {
          res.json({
            status: 0,
            message: 'Error while updating global user follow',
            data: []
          })
        } else {
          con.query('select * from users where id = "' + followingUserId + '"', function (error, selectedRows, fields) {
            if (selectedRows.length > 0) {
              if (selectedRows[0].notification_mystuff == 'Push') {
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm +" you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response); 
                  }
                });
                //---------------push notification---------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Email') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm +' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Both') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm +' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm +" you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response);
                  }
                });
                //---------------push notification---------------------//
              }
            }

            let followingArray = [];
            con.query('SELECT * FROM global_user_follow WHERE user_id = "' + userId + '" ORDER BY id DESC', function (ferror, frows, ffields) {
              if (frows.length > 0) {
                async.eachSeries(frows, function iteratee(frow, callback) {
                  con.query('SELECT * FROM users WHERE id = "' + frow.following_userId + '"', function (userError, userrow, userfields) {
                    if (userrow.length > 0) {
                      followingArray.push({
                        id: userrow[0].id,
                        name: userrow[0].username,
                        image: user_image_url + userrow[0].image,
                        status: frow.status
                      })
                    }
                    callback();
                  })
                }, function done() {
                  res.json({
                    status: 1,
                    message: 'Global User Following List',
                    data: followingArray
                  });
                })
              } else {
                res.json({
                  status: 0,
                  message: 'No Record Found',
                  data: []
                });
              }
            });

          });
        }
      });
    } else {
      con.query('INSERT INTO global_user_follow(`user_id`,`following_userId`,`status`,`deviceName`,`deviceToken`) VALUES ("' + userId + '","' + followingUserId + '","' + status + '","' + deviceName + '","' + deviceToken + '")', function (followError, followResult, followFields) {
        if (!followError) {
          con.query('select * from users where id = "' + followingUserId + '"', function (error, selectedRows, fields) {
            if (selectedRows.length > 0) {
              if (selectedRows[0].notification_mystuff == 'Push') {
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm +" you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response); 
                  }
                });
                //---------------push notification---------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Email') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm +' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Both') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm +' you</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm +" you"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response);
                  }
                });
                //---------------push notification---------------------//
              }
            }

            let followingArray = [];
            con.query('SELECT * FROM global_user_follow WHERE user_id = "' + userId + '" ORDER BY id DESC', function (ferror, frows, ffields) {
              if (frows.length > 0) {
                async.eachSeries(frows, function iteratee(frow, callback) {
                  con.query('SELECT * FROM users WHERE id = "' + frow.following_userId + '"', function (userError, userrow, userfields) {
                    if (userrow.length > 0) {
                      followingArray.push({
                        id: userrow[0].id,
                        name: userrow[0].username,
                        image: user_image_url + userrow[0].image,
                        status: frow.status
                      })
                    }
                    callback();
                  })
                }, function done() {
                  res.json({
                    status: 1,
                    message: 'Global User Following List',
                    data: followingArray
                  });
                })
              } else {
                res.json({
                  status: 0,
                  message: 'No Record Found',
                  data: []
                });
              }
            });

          });
        } else {
          res.json(followError);
        }
      })
    }
  });
});

// Global Search
app.post('/searchglobaluser', function (req, res) {
  let searchText = req.body.search;
  var userId = req.body.userId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM users WHERE username LIKE "%' + searchText + '%" ORDER BY id DESC', function (error, rows, fields) {
    if (!error) {
      if (rows.length > 0) {
        let newsArray = [];
        async.eachSeries(rows, function iteratee(row, callback) {
          con.query('SELECT * FROM users WHERE id = "' + row.id + '"', function (userError, userrow, userfields) {
            con.query('SELECT * FROM global_user_follow WHERE user_id = "' + userId + '" AND following_userId = "' + row.id + '"', function (ferror, frows, ffields) {
              if (frows.length > 0) {
                if (frows[0].status != "1") {
                  newsArray.push({
                    id: userrow[0].id,
                    name: userrow[0].username,
                    image: user_image_url + userrow[0].image,
                    status: frows[0].status,
                  })
                } else {
                  newsArray.push({
                    id: userrow[0].id,
                    name: userrow[0].username,
                    image: user_image_url + userrow[0].image,
                    status: frows[0].status,
                  })
                }
              } else {
                if (userrow.length > 0) {
                  newsArray.push({
                    id: userrow[0].id,
                    name: userrow[0].username,
                    image: user_image_url + userrow[0].image,
                    status: "0",
                  })
                }
              }
              callback();
            })
          })
        }, function done() {
          res.json({
            status: 1,
            message: 'Global Following Search List',
            data: newsArray
          });
        })
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Add Global User Comment
app.post('/addglobalcomment', function (req, res) {
  var userId = req.body.userId;
  var username = req.body.username;
  var missionId = req.body.missionId;
  var globaluserId = req.body.globaluserId;
  var activityId = req.body.activityId;
  var comment = req.body.comment;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('INSERT INTO global_user_comments(`user_id`,`mission_id`,`globaluserId`,`activityId`,`username`,`comment`,`deviceName`,`deviceToken`) VALUES ("' + userId + '","' + missionId + '","' + globaluserId + '","' + activityId + '","' + username + '","' + comment + '","' + deviceName + '","' + deviceToken + '")', function (followError, followResult, followFields) {
    if (!followError) {

      con.query('select * from users where id = "' + globaluserId + '"', function (error, selectedRows, fields) {
        if (selectedRows.length > 0) {
          if (selectedRows[0].notification_mystuff == 'Push') {
            //---------------push notification---------------------//
            var gcm = require('node-gcm');
            var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
            var message = new gcm.Message({
              data: { key1: 'msg1' },
              notification: {
                title: "News for you",
                icon: "http://flux-qa.com/uploads/logo.png",
                body: "Hi, " + username + " commenting in your mission"
              }
            });
            var regTokens = [selectedRows[0].deviceToken];
            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
              if (err) {
                //console.error(err);
              } else {
                //console.log(response); 
              }
            });
            //---------------push notification---------------------//
          }
          if (selectedRows[0].notification_mystuff == 'Email') {
            //----------------------email send start---------------------------//
            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              // // secure: true,
              auth: {
                user: 'noreplyfluxmission@gmail.com',
                pass: 'Include!23'
              }
            });
            var mailOptions = {
              from: 'noreplyfluxmission@gmail.com',
              to: selectedRows[0].email,
              subject: 'Flux Mission',
              html: '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<title>Flux Mission</title>' +
                '</head>' +
                '<body>' +
                '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                '<div style = "background:#000;">' +
                '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                '</div>' +
                '<hr style="border:1px solid #000;width:500px">' +
                '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                '<p>Hi, ' + username + ' commenting in your mission</p>' +
                '</div>' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                '</div>' +
                '<hr style="border:1px solid #000;width:600px">' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                'Kind Regards,<br>' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                'Flux Mission</div>' +
                '</div>' +
                '</div>' +
                '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                '<div class="yj6qo"></div><div class="adL"></div>' +
                '</div></div>' +
                '</body>' +
                '</html>',
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                //console.log(error);
              } else {
                //console.log('Email sent: ' + info.response);
              }
            });
            //--------------------------email send end-------------------------------//
          }
          if (selectedRows[0].notification_mystuff == 'Both') {
            //----------------------email send start---------------------------//
            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              // // secure: true,
              auth: {
                user: 'noreplyfluxmission@gmail.com',
                pass: 'Include!23'
              }
            });
            var mailOptions = {
              from: 'noreplyfluxmission@gmail.com',
              to: selectedRows[0].email,
              subject: 'Flux Mission',
              html: '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<title>Flux Mission</title>' +
                '</head>' +
                '<body>' +
                '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                '<div style = "background:#000;">' +
                '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                '</div>' +
                '<hr style="border:1px solid #000;width:500px">' +
                '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                '<p>Hi, ' + username + ' commenting in your mission</p>' +
                '</div>' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                '</div>' +
                '<hr style="border:1px solid #000;width:600px">' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                'Kind Regards,<br>' +
                '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                'Flux Mission</div>' +
                '</div>' +
                '</div>' +
                '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                '<div class="yj6qo"></div><div class="adL"></div>' +
                '</div></div>' +
                '</body>' +
                '</html>',
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                //console.log(error);
              } else {
                //console.log('Email sent: ' + info.response);
              }
            });
            //--------------------------email send end-------------------------------//
            //---------------push notification---------------------//
            var gcm = require('node-gcm');
            var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
            var message = new gcm.Message({
              data: { key1: 'msg1' },
              notification: {
                title: "News for you",
                icon: "http://flux-qa.com/uploads/logo.png",
                body: "Hi, " + username + " commenting in your mission"
              }
            });
            var regTokens = [selectedRows[0].deviceToken];
            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
              if (err) {
                //console.error(err);
              } else {
                //console.log(response);
              }
            });
            //---------------push notification---------------------//
          }
        }  

        let commentArray = [];
        con.query('SELECT * FROM global_user_comments WHERE activityId = "' + activityId + '" AND globaluserId = "' + globaluserId + '" ORDER BY id DESC', function (aerror, arows, afields) {
          if (arows.length > 0) {
            for (var count = 0; count < arows.length; count++) {
              var now = new Date(arows[count].create_date);
              commentArray.push({
                "commentId": arows[count].id,
                "comment": arows[count].comment,
                "create_date": dateFormat(now, "dd-mm-yyyy h:MM:ss TT"),
                "username": arows[count].username,
              });
            }
            res.json({
              status: 1,
              message: 'Comment Add Successfully',
              data: commentArray
            })
          } else {
            res.json({
              status: 0,
              message: 'No Record Found',
              data: []
            });
          }
        });

      });

    } else {
      res.json(followError);
    }
  })
});

// Global User Comment List
app.post('/globalcommentlist', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var globaluserId = req.body.globaluserId;
  var activityId = req.body.activityId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  let commentArray = [];
  con.query('SELECT * FROM global_user_comments WHERE activityId = "' + activityId + '" AND globaluserId = "' + globaluserId + '" ORDER BY id DESC', function (aerror, arows, afields) {
    if (arows.length > 0) {
      for (var count = 0; count < arows.length; count++) {
        var now = new Date(arows[count].create_date);
        commentArray.push({
          "commentId": arows[count].id,
          "comment": arows[count].comment,
          "create_date": dateFormat(now, "dd-mm-yyyy h:MM:ss TT"),
          "username": arows[count].username,
        });
      }
      res.json({
        status: 1,
        message: 'Comments List',
        data: commentArray
      })
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Global Mission Like / Dislike
app.post('/globalmissionlike', function (req, res) {
  var userId = req.body.userId;
  var username = req.body.username;
  var missionId = req.body.missionId;
  var globaluserId = req.body.globaluserId;
  var activityId = req.body.activityId;
  var like_status = req.body.like_status;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  if (like_status == '1') {
    var lsm = 'like';
  } else {
    var lsm = 'unlike';
  }
  con.query('SELECT * FROM global_user_like WHERE user_id = "' + userId + '" AND activityId = "' + activityId + '" AND globaluserId = "' + globaluserId + '"', function (error, selectedRows, fields) {
    if (selectedRows.length > 0) {
      if (missionId == selectedRows[0].mission_id) {
        con.query('UPDATE global_user_like SET like_status = "' + like_status + '" WHERE user_id = "' + userId + '" AND activityId = "' + activityId + '" AND globaluserId = "' + globaluserId + '"', function (updateError, updateRow) {
          if (updateError) {
            res.json({
              status: 0,
              message: 'Error while updating global like'
            })
          } else {
            con.query('select * from users where id = "' + globaluserId + '"', function (error, selectedRows, fields) {
              if (selectedRows.length > 0) {

                if (selectedRows[0].notification_mystuff == 'Push') {
                  //---------------push notification---------------------//
                  var gcm = require('node-gcm');
                  var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                  var message = new gcm.Message({
                    data: { key1: 'msg1' },
                    notification: {
                      title: "News for you",
                      icon: "http://flux-qa.com/uploads/logo.png",
                      body: "Hi, " + username + " " + lsm +" in your mission"
                    }
                  });
                  var regTokens = [selectedRows[0].deviceToken];
                  sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                    if (err) {
                      //console.error(err);
                    } else {
                      //console.log(response); 
                    }
                  });
                  //---------------push notification---------------------//
                }
                if (selectedRows[0].notification_mystuff == 'Email') {
                  //----------------------email send start---------------------------//
                  var nodemailer = require('nodemailer');
                  var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    // // secure: true,
                    auth: {
                      user: 'noreplyfluxmission@gmail.com',
                      pass: 'Include!23'
                    }
                  });
                  var mailOptions = {
                    from: 'noreplyfluxmission@gmail.com',
                    to: selectedRows[0].email,
                    subject: 'Flux Mission',
                    html: '<!DOCTYPE html>' +
                      '<html>' +
                      '<head>' +
                      '<title>Flux Mission</title>' +
                      '</head>' +
                      '<body>' +
                      '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                      '<div style = "background:#000;">' +
                      '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                      '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                      '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                      '</div>' +
                      '<hr style="border:1px solid #000;width:500px">' +
                      '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                      '<p>Hi, ' + username + ' ' + lsm +' in your mission</p>' +
                      '</div>' +
                      '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                      'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                      '</div>' +
                      '<hr style="border:1px solid #000;width:600px">' +
                      '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                      'Kind Regards,<br>' +
                      '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                      'Flux Mission</div>' +
                      '</div>' +
                      '</div>' +
                      '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                      '<div class="yj6qo"></div><div class="adL"></div>' +
                      '</div></div>' +
                      '</body>' +
                      '</html>',
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      //console.log(error);
                    } else {
                      //console.log('Email sent: ' + info.response);
                    }
                  });
                  //--------------------------email send end-------------------------------//
                }
                if (selectedRows[0].notification_mystuff == 'Both') {
                  //----------------------email send start---------------------------//
                  var nodemailer = require('nodemailer');
                  var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    // // secure: true,
                    auth: {
                      user: 'noreplyfluxmission@gmail.com',
                      pass: 'Include!23'
                    }
                  });
                  var mailOptions = {
                    from: 'noreplyfluxmission@gmail.com',
                    to: selectedRows[0].email,
                    subject: 'Flux Mission',
                    html: '<!DOCTYPE html>' +
                      '<html>' +
                      '<head>' +
                      '<title>Flux Mission</title>' +
                      '</head>' +
                      '<body>' +
                      '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                      '<div style = "background:#000;">' +
                      '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                      '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                      '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                      '</div>' +
                      '<hr style="border:1px solid #000;width:500px">' +
                      '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                      '<p>Hi, ' + username + ' ' + lsm +' in your mission</p>' +
                      '</div>' +
                      '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                      'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                      '</div>' +
                      '<hr style="border:1px solid #000;width:600px">' +
                      '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                      'Kind Regards,<br>' +
                      '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                      'Flux Mission</div>' +
                      '</div>' +
                      '</div>' +
                      '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                      '<div class="yj6qo"></div><div class="adL"></div>' +
                      '</div></div>' +
                      '</body>' +
                      '</html>',
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      //console.log(error);
                    } else {
                      //console.log('Email sent: ' + info.response);
                    }
                  });
                  //--------------------------email send end-------------------------------//
                  //---------------push notification---------------------//
                  var gcm = require('node-gcm');
                  var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                  var message = new gcm.Message({
                    data: { key1: 'msg1' },
                    notification: {
                      title: "News for you",
                      icon: "http://flux-qa.com/uploads/logo.png",
                      body: "Hi, " + username + " " + lsm +" in your mission"
                    }
                  });
                  var regTokens = [selectedRows[0].deviceToken];
                  sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                    if (err) {
                      //console.error(err);
                    } else {
                      //console.log(response);
                    }
                  });
                  //---------------push notification---------------------//
                }
              }  

              con.query('SELECT user_activity.id as activityId,user_activity.mission_id as missionId,user_activity.last_distance as lastDistance,user_activity.distance_type as distanceType,user_activity.activity as user_activity,users.id as globaluserId,users.username as user_name,users.image as user_image FROM `user_activity` JOIN users ON user_activity.user_id = users.id WHERE addCommunity = "Yes" ORDER BY user_activity.id DESC', function (error, rows, fields) {
                if (rows.length > 0) {
                  let newsArray = [];
                  async.eachSeries(rows, function iteratee(row, callback) {
                    con.query('SELECT * FROM global_user_like WHERE activityId = "' + row.activityId + '" AND globaluserId = "' + row.globaluserId + '" AND user_id = "' + userId + '"', function (serror, sRows, sfields) {
                      if (sRows.length > 0) {
                        newsArray.push({
                          activityId: row.activityId,
                          globaluserId: row.globaluserId,
                          name: row.user_name,
                          image: user_image_url + row.user_image,
                          like_status: sRows[0].like_status,
                          mission_id: row.missionId,
                          distance_type: row.distanceType,
                          mission_distance: row.lastDistance,
                          activity: row.user_activity
                        })
                      } else {
                        newsArray.push({
                          activityId: row.activityId,
                          globaluserId: row.globaluserId,
                          name: row.user_name,
                          image: user_image_url + row.user_image,
                          like_status: '0',
                          mission_id: row.missionId,
                          mission_distance: row.lastDistance,
                          distance_type: row.distanceType,
                          activity: row.user_activity
                        })
                      }
                      callback();
                    })
                  }, function done() {
                    res.json({
                      status: 1,
                      message: 'Global News Feed',
                      data: newsArray
                    });
                  })
                } else {
                  res.json({
                    status: 0,
                    message: 'No Record Found',
                    data: []
                  });
                }
              });
            });
          }
        })
      } else {
        res.json({
          status: 0,
          message: 'Mission Not Exist',
          data: []
        });
      }
    } else {
      con.query('INSERT INTO global_user_like(`user_id`,`mission_id`,`globaluserId`,`activityId`,`like_status`,`deviceName`,`deviceToken`) VALUES ("' + userId + '","' + missionId + '","' + globaluserId + '","' + activityId + '","' + like_status + '","' + deviceName + '","' + deviceToken + '")', function (insertError, insertResult, insertFields) {
        if (insertError) {
          res.json({
            status: 0,
            message: 'Error while inserting global like'
          })
        } else {

          con.query('select * from users where id = "' + globaluserId + '"', function (error, selectedRows, fields) {
            if (selectedRows.length > 0) {
              if (selectedRows[0].notification_mystuff == 'Push') {
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm +" in your mission"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response); 
                  }
                });
                //---------------push notification---------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Email') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm +' in your mission</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
              }
              if (selectedRows[0].notification_mystuff == 'Both') {
                //----------------------email send start---------------------------//
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  // // secure: true,
                  auth: {
                    user: 'noreplyfluxmission@gmail.com',
                    pass: 'Include!23'
                  }
                });
                var mailOptions = {
                  from: 'noreplyfluxmission@gmail.com',
                  to: selectedRows[0].email,
                  subject: 'Flux Mission',
                  html: '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<title>Flux Mission</title>' +
                    '</head>' +
                    '<body>' +
                    '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
                    '<div style = "background:#000;">' +
                    '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
                    '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
                    '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:500px">' +
                    '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    '<p>Hi, ' + username + ' ' + lsm +' in your mission</p>' +
                    '</div>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
                    'For any help or assistance, reach out to us anytime at <a style="font-size:12px" href="mailto:info@fluxmission.com" style="text-decoration: none; color: #000" target="_blank">info@fluxmission.com</a>' +
                    '</div>' +
                    '<hr style="border:1px solid #000;width:600px">' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
                    'Kind Regards,<br>' +
                    '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
                    'Flux Mission</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
                    '<div class="yj6qo"></div><div class="adL"></div>' +
                    '</div></div>' +
                    '</body>' +
                    '</html>',
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    //console.log(error);
                  } else {
                    //console.log('Email sent: ' + info.response);
                  }
                });
                //--------------------------email send end-------------------------------//
                //---------------push notification---------------------//
                var gcm = require('node-gcm');
                var sender = new gcm.Sender('AAAAPhY09a8:APA91bFF_0lnIMZqqwFAMud9xPE3pqTIics8AiH9CCmexDYqRLlKR9aDBvY-Oz3hI83GsrJgyHGt1d5wZDQPyDsnWhBL_7Le6soGbH06ALoWvui1MWYo2AiBstmsjQpjjGa9SQj77r7t');
                var message = new gcm.Message({
                  data: { key1: 'msg1' },
                  notification: {
                    title: "News for you",
                    icon: "http://flux-qa.com/uploads/logo.png",
                    body: "Hi, " + username + " " + lsm +" in your mission"
                  }
                });
                var regTokens = [selectedRows[0].deviceToken];
                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    //console.error(err);
                  } else {
                    //console.log(response);
                  }
                });
                //---------------push notification---------------------//
              }
            }  

              con.query('SELECT user_activity.id as activityId,user_activity.mission_id as missionId,user_activity.last_distance as lastDistance,user_activity.distance_type as distanceType,user_activity.activity as user_activity,users.id as globaluserId,users.username as user_name,users.image as user_image FROM `user_activity` JOIN users ON user_activity.user_id = users.id WHERE addCommunity = "Yes" ORDER BY user_activity.id DESC', function (error, rows, fields) {
                if (rows.length > 0) {
                  let newsArray = [];
                  async.eachSeries(rows, function iteratee(row, callback) {
                    con.query('SELECT * FROM global_user_like WHERE activityId = "' + row.activityId + '" AND globaluserId = "' + row.globaluserId + '" AND user_id = "' + userId + '"', function (serror, sRows, sfields) {
                      if (sRows.length > 0) {
                        newsArray.push({
                          activityId: row.activityId,
                          globaluserId: row.globaluserId,
                          name: row.user_name,
                          image: user_image_url + row.user_image,
                          like_status: sRows[0].like_status,
                          mission_id: row.missionId,
                          distance_type: row.distanceType,
                          mission_distance: row.lastDistance,
                          activity: row.user_activity
                        })
                      } else {
                        newsArray.push({
                          activityId: row.activityId,
                          globaluserId: row.globaluserId,
                          name: row.user_name,
                          image: user_image_url + row.user_image,
                          like_status: '0',
                          mission_id: row.missionId,
                          mission_distance: row.lastDistance,
                          distance_type: row.distanceType,
                          activity: row.user_activity
                        })
                      }
                      callback();
                    })
                  }, function done() {
                    res.json({
                      status: 1,
                      message: 'Global News Feed',
                      data: newsArray
                    });
                  })
                } else {
                  res.json({
                    status: 0,
                    message: 'No Record Found',
                    data: []
                  });
                }
              });
          });
        }
      })
    }
  });
});

// Global News Feed
app.post('/newsfeed', function (req, res) {
  let userId = req.body.userId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  var addCommunity = 'Yes';
  con.query('SELECT user_activity.id as activityId,user_activity.mission_id as missionId,user_activity.last_distance as lastDistance,user_activity.distance_type as distanceType,user_activity.activity as user_activity,users.id as globaluserId,users.username as user_name,users.image as user_image FROM `user_activity` JOIN users ON user_activity.user_id = users.id WHERE addCommunity = "Yes" ORDER BY user_activity.id DESC', function (error, rows, fields) {
    if (rows.length > 0) {
      let newsArray = [];
      async.eachSeries(rows, function iteratee(row, callback) {
        con.query('SELECT * FROM global_user_like WHERE activityId = "' + row.activityId + '" AND globaluserId = "' + row.globaluserId + '" AND user_id = "' + userId + '"', function (serror, sRows, sfields) {
          if (sRows.length > 0) {
            newsArray.push({
              activityId: row.activityId,
              globaluserId: row.globaluserId,
              name: row.user_name,
              image: user_image_url + row.user_image,
              like_status: sRows[0].like_status,
              mission_id: row.missionId,
              distance_type: row.distanceType,
              mission_distance: row.lastDistance,
              activity: row.user_activity
            })
          } else {
            newsArray.push({
              activityId: row.activityId,
              globaluserId: row.globaluserId,
              name: row.user_name,
              image: user_image_url + row.user_image,
              like_status: '0',
              mission_id: row.missionId,
              mission_distance: row.lastDistance,
              distance_type: row.distanceType,
              activity: row.user_activity
            })
          }
          callback();
        })
      }, function done() {
        res.json({
          status: 1,
          message: 'Global News Feed',
          data: newsArray
        });
      })
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Community - Following
app.post('/community', function (req, res) {
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_mission ORDER BY id DESC', function (error, rows, fields) {
    if (rows.length > 0) {
      let newsArray = [];
      async.eachSeries(rows, function iteratee(row, callback) {
        con.query('SELECT * FROM users WHERE id = "' + row.user_id + '"', function (userError, userrow, userfields) {
          if (userrow.length > 0) {
            con.query('SELECT * FROM mission WHERE status = 1 AND id = "' + row.mission_id + '"', function (missionError, missionrow, missionfields) {
              newsArray.push({
                id: userrow[0].id,
                name: userrow[0].username,
                image: user_image_url + userrow[0].image,
                status: row.status,
                mission_name: missionrow[0].name,
                like_status: row.like_status
              })
            })
          }
          callback();
        })
      }, function done() {
        newsArray = newsArray.sort(() => Math.random() - 0.5)
        res.json({
          status: 1,
          message: 'Community List',
          data: newsArray
        });
      })
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// User Comment List
app.post('/commentlist', function (req, res) {
  var userId = req.body.userId;
  var missionId = req.body.missionId;
  var activityId = req.body.activityId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  let commentArray = [];
  con.query('SELECT * FROM user_comments WHERE user_id = "' + userId + '" AND mission_id = "' + missionId + '" AND activity_id = "' + activityId + '" ORDER BY id DESC', function (aerror, arows, afields) {
    if (arows.length > 0) {
      for (var count = 0; count < arows.length; count++) {
        var now = new Date(arows[count].create_date);
        commentArray.push({
          "commentId": arows[count].id,
          "comment": arows[count].comment,
          "create_date": dateFormat(now, "dd-mm-yyyy h:MM:ss TT"),
        });
      }
      res.json({
        status: 1,
        message: 'Comments List',
        data: commentArray
      })
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Help Support
app.post('/helpsupport', function (req, res) {
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM helpinfo', function (aerror, arows, afields) {
    if (arows.length > 0) {
      let newsArray = [];
      let reason = JSON.parse(arows[0].reason);
      newsArray.push({
        support_email: arows[0].support_email,
        user_guide: pdf_url + arows[0].user_guide,
        help_text: arows[0].help_text,
        support_text: arows[0].support_text,
        reason: JSON.parse(reason)
      })
      res.json({
        status: 1,
        message: 'Help & Support',
        data: newsArray
      })
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// App Banner
app.post('/banner', function (req, res) {
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM slider WHERE status = 1 ORDER BY id DESC', function (serror, srows, sfields) {
    if (srows.length > 0) {
      let sliderArray = [];
      let count = 0;
      for (let i = 0; i < srows.length; i++) {
        sliderArray.push({
          banner: banner_image + srows[i].image,
          position: srows[i].imageOrder
        });
      }
      res.json({
        status: 1,
        message: 'Banner List',
        data: sliderArray
      });
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Send Message
app.post('/sendmessage', function (req, res) {
  var userEmail = req.body.userEmail;
  var supportEmail = req.body.supportEmail;
  var subject = req.body.subject;
  var message = req.body.message;
  var fname = '';
  var lname = '';
  var mobile = '';
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('INSERT INTO contacts(`fname`,`lname`,`email`,`mobile`,`inquiry`,`message`) VALUES ("' + fname + '","' + lname + '","' + userEmail + '","' + mobile + '","' + subject + '","' + message + '")', function (cError, cResult, cFields) {
    if (!cError) {
      //----------------------email send start---------------------------//
      var nodemailer = require('nodemailer');
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        // // secure: true,
        auth: {
          user: 'noreplyfluxmission@gmail.com',
          pass: 'Include!23'
        }
      });
      var mailOptions = {
        from: userEmail,
        to: supportEmail,
        subject: subject,
        html: '<!DOCTYPE html>' +
          '<html>' +
          '<head>' +
          '<title>Flux Mission - Support</title>' +
          '</head>' +
          '<body>' +
          '<div style = "background:#000;text-align:center;max-width: 1000px;margin: auto;">' +
          '<div style = "background:#000;">' +
          '<div style="background:#ffffff;margin: auto;border: 10px solid #000;padding: 30px 15px;">' +
          '<div style="font-family:Roboto Slab,sans-serif;color:#212e43;font-size:18px;font-weight:bold;text-align:center;padding:12px 0px 0px">' +
          '<img src="' + email_logo + 'logo-black.png" style="height: 150px;" class="CToWUd" />' +
          '</div>' +
          '<hr style="border:1px solid #000;width:500px">' +
          '<div style="text-align:center;color:#212e43;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:400;padding:20px;line-height:1.8">' +
          '<p> ' + message + ' </p>' +
          '</div>' +
          '<hr style="border:1px solid #000;width:600px">' +
          '<div style="text-align:center;font-family:Roboto Slab,sans-serif;font-size:16px;font-weight:500;font-style:italic;color:#a9a9a9;line-height:1.8">' +
          'Kind Regards,<br>' +
          '<div style="text-align:center;font-family:Roboto Slab,sans-serif;color:#212e43;font-size:16px;font-weight:bolder">' +
          'Flux Mission</div>' +
          '</div>' +
          '</div>' +
          '<div style="font-family:Roboto Slab,sans-serif;text-align:center;color:#212e43;padding: 0px 0 10px;font-family:Roboto Slab,sans-serif;font-size:15px;margin:auto;">' +
          '<div class="yj6qo"></div><div class="adL"></div>' +
          '</div></div>' +
          '</body>' +
          '</html>',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          //console.log(error);
        } else {
          //console.log('Email sent: ' + info.response);
        }
      });
      //--------------------------email send end-------------------------------//
      res.json({
        status: 1,
        message: 'Message Send Successfully',
      })
    } else {
      res.json(cError);
    }
  })
});

// User Notifications List
app.post('/notificationslist', function (req, res) {
  let userId = req.body.userId;
  let deviceToken = req.body.deviceToken;
  let deviceName = req.body.deviceName;
  con.query('SELECT * FROM user_notifications WHERE user_id = "' + userId + '" ORDER BY id DESC', function (serror, srows, sfields) {
    if (srows.length > 0) {
      let notificationsArray = [];
      for (let i = 0; i < srows.length; i++) {
        var now = new Date(srows[i].create_date);
        if (srows[i].image != '') {
          var imagepath = notification_image_url + srows[i].image;
        } else {
          var imagepath = '';
        }

        notificationsArray.push({
          title: srows[i].title,
          description: srows[i].description,
          image: imagepath,
          create_date: dateFormat(now, "dd-mm-yyyy h:MM:ss TT"),
        });
      }
      res.json({
        status: 1,
        message: 'User Notifications List',
        data: notificationsArray
      });
    } else {
      res.json({
        status: 0,
        message: 'No Record Found',
        data: []
      });
    }
  });
});

// Global User Profile
app.post('/guserprofile', function (req, res) {
  var userId = req.body.userId;
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  if (userId == "") {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.',
    });
  } else {
    con.query('select * from users where id = "' + userId + '"', function (error, selectedRows, fields) {
      if (selectedRows.length > 0) {
        var jsonObj = ({
          userId: selectedRows[0].id,
          username: selectedRows[0].username,
          firstname: selectedRows[0].firstname,
          lastname: selectedRows[0].lastname,
          email: selectedRows[0].email,
          phone: selectedRows[0].phone,
          image: user_image_url+selectedRows[0].image
        });
        res.json({
          status: 1,
          message: 'User Profile',
          data: jsonObj
        });
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    });
  }
});

// Privacy Policy Page
app.post('/privacypolicy', function (req, res) {
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  if (deviceName == "") {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.',
    });
  } else {
    con.query('SELECT * FROM pages WHERE status = 1 ORDER BY id DESC', function (error, selectedRows, fields) {
      if (selectedRows.length > 0) {
        let pageArray = [];
        async.eachSeries(selectedRows, function iteratee(selectedRow, callback) {
          if (selectedRow.titleUrl == 'privacy-policy') {
            pageArray.push({
              name: selectedRow.name,
              description: selectedRow.description
            });
          }
          callback();
        }, function done() {
          res.json({
            status: 1,
            message: 'Privacy Policy',
            data: pageArray[0]
          });
        })
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    });
  }
});

// Terms Conditions Page
app.post('/termsconditions', function (req, res) {
  var deviceName = req.body.deviceName;
  var deviceToken = req.body.deviceToken;
  if (deviceName == "") {
    res.json({
      status: 0,
      message: 'Sorry, please provide your input details.',
    });
  } else {
    con.query('SELECT * FROM pages WHERE status = 1 ORDER BY id DESC', function (error, selectedRows, fields) {
      if (selectedRows.length > 0) {
        let pageArray = [];
        async.eachSeries(selectedRows, function iteratee(selectedRow, callback) {
          if (selectedRow.titleUrl == 'terms-conditions') {
            pageArray.push({
              name: selectedRow.name,
              description: selectedRow.description
            });
          }
          callback();
        }, function done() {
          res.json({
            status: 1,
            message: 'Terms Conditions',
            data: pageArray[0]
          });
        })
      } else {
        res.json({
          status: 0,
          message: 'No Record Found',
          data: []
        });
      }
    });
  }
});
/*** App API end here ***/
//=====================================================================================================================================
server.listen(port, (error) => {
  console.log('Node app is running on port ' + port);
});