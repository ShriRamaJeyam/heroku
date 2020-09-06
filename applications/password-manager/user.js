const CryptoJS = require('crypto-js');
const express = require('express');
const env = require('../../env');
const errorCodes = require('../../utilities/errorCodes');
const { deepClone } = require('../../utilities/utilities');
const requestHandler = require('./requestHandler')
const { Users, Passwords, Tags } = require('./db');

const router = express.Router();

// Authenticator
router.use(async(req,res,next) => {
    try
    {
        const { auth } = req.body;
        let user;
        if(auth.id)
        {
            user = await Users.findOne({
                where:{
                    id : auth.id
                },
                attributes : ['id','hash']
            });
        }
        else if(auth.username)
        {
            user = await Users.findOne({
                where:{
                    username : auth.username
                },
                attributes : ['id','hash']
            });
            console.log(user);
            req.body.user = deepClone(user);
        }
        else
        {
            throw "error";
        }
        if(!user)
        {
            res.json({
                status: "error",
                error_code : errorCodes.AUTHENTICATION_ERROR_NOUSER,
                error_message : `There is no such user.`
            });
        }
        else if( 
            Math.abs(((new Date()).getTime()) - auth.millis) <= env.pswd_mngr.req_auth_timeout &&
            CryptoJS.HmacSHA256(`${auth.millis}`,user.hash).toString(CryptoJS.enc.Hex) === auth.hash
        )
        {
            next();
        }
        else
        {
            res.json({
                status: "error",
                error_code : errorCodes.AUTHENTICATION_ERROR,
                error_message : `The password is either wrong or check the time in your local system.`
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
        status:'ok',
        id : req.body.user.id
    });
});

router.post('/listTag',requestHandler({ utility : async(data) => {
    return (await Tags.findAll({attributes:['tag']})).map(v => v.tag);
} }));

module.exports = router;