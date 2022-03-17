const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const key = require('../../setup/mongoose-connection');
const jwt = require('jsonwebtoken');
const passport = require('passport');


//Getting person schema
const Person = require('../../models/person');

//@Type     POST
//@route    /api/auth/register
//@desc     route for register user
//@access   PUBLIC
router.post('/register',(req,res)=>{
    Person.findOne({email:req.body.email}).then(user=>{
        if(user){
            res.status(400).json({
                message:"Already you registered with this email, please login..!"
            })
        }else{
            let user = new Person({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            });

            //encrypt the password using bcrypt 
            bcrypt.hash(user.password, 10, (err,hash)=>{
                if(err) throw err;
                user.password = hash;
                user.save()
                .then(user=>{
                    if(user){
                        res.json({
                            message:"You have been registed successfully..!",
                            success:true,
                            data:user
                        })
                    }else{
                        res.json({
                            message:"something went wrong",
                            success:false
                        })
                    }
                })
                .catch(err=>{
                    console.log(`Error in saving the user while registering is :${err}`);
                })

            })
        
        }
    }).catch(err=>{
        console.log(`Error in registering the user is : ${err}`);
    })
});

//@Type     POST
//@route    /api/auth/login
//@desc     route for login to user
//@access   PUBLIC

router.post('/login',(req,res)=>{
    Person.findOne({email:req.body.email}).then(user=>{
        if(user){
            bcrypt.compare(req.body.password, user.password).then(isTrue=>{
                if(isTrue){
                    let payload = {
                        id:user.id,
                        email:user.email,
                        password:user.password
                    }

                    //authenticate and Generating the token
                    jwt.sign(payload, key.secret,{expiresIn:300000},(err,token)=>{
                        if(err) throw err
                        res.json({
                            message:"You have logged in successfully..!",
                            success:true,
                            token:`Bearer ${token}`
                        })
                    })
                    
                }else{
                    res.json({
                        message:"Password incorrect"
                    })
                }
            })
           
        }else{
           res.status(404).json({
               message:"You don't have account with this email",
               success:false
           })
        }
    }).catch(err=>{
        console.log(`Error in registering the user is : ${err}`);
    })
});

router.get('/user', passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json(req.user);
})

module.exports = router;
