const CryptoJS = require('crypto-js');
const express = require('express');
const env = require('../../env');
const errorCodes = require('../../utilities/errorCodes');
const requestHandler = require('./requestHandler')
const { Users } = require('./db')

const router = express.Router();

// Authenticator
router.use(async(req,res,next) => {
    try
    {
        const { auth } = req.body;
        if( 
            Math.abs(((new Date()).getTime()) - auth.millis) <= env.pswd_mngr.req_auth_timeout &&
            (CryptoJS.SHA256(env.pswd_mngr.admin_pass + auth.millis)).toString(CryptoJS.enc.Hex) === auth.hash
        )
        {
            next();
        }
        else
        {
            res.json({
                status: "error",
                error_code : errorCodes.AUTHENTICATION_ERROR,
                error_message : `The administrator password is either wrong or check the time in your local system.`
            });
        }
    }
    catch(except)
    {
        console.log(except);
        res.json({
            status: "error",
            error_code : errorCodes.REQUEST_FORMAT_ERROR,
            error_message : `Check if the format of request is correct. View api documentation.`
        });
    }
});

router.post('/auth',async(req,res) => {
    res.json({
        status:'ok'
    });
});

router.post('/listUser',requestHandler({ utility : async(data) => {
    return (await Users.findAll({attributes:['username']})).map(v => v.username);
} }));

router.post('/addUser',requestHandler({ utility : async(data) => {
    const { username, hash } = data;
    return await Users.create({ username,hash });
} }));

module.exports = router;