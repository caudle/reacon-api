import express from 'express';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios'
import https from 'https';

import User from '../models/user.js';
import Otp from '../models/otp.js';
import Sms from '../models/sms.js';
import { validateRegister, validateLogin, validatePhone, validateChangePass } from '../middlewares/validation.js';


const router = express.Router();

// register user
router.post('/register', async (req, res) => {
    // validate details
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // check if email exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json({ error: 'email already exists' });
    // hashing password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(req.body.password, salt);
  
    // create user in db
    const user = new User({
      phone: req.body.phone,
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      isemailVerified: req.body.isemailVerified,
      isphoneVerified: req.body.isphoneVerified,
      dp: req.body.dp,
      type: req.body.type,
    });
    try {
      const savedUser = await user.save();
      // create token
      const token = jwt.sign({id:savedUser._id,email:savedUser.email},process.env.TOKEN_SECRET,{});   
      // return user and token
      return res.status(201).json({ user: savedUser, token });
    } catch (err) {
      res.status(400).json({ error: 'something went wrong ' + err });
    }
  });

  // login user
router.post('/login', async (req, res) => {
    // validate login details
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'user not found' });
    // validate password
    const validPassword = await bycrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'incorrect password or email' });
    //create token
    const token = jwt.sign({id:user._id,email:user.email},process.env.TOKEN_SECRET,{});

    return res.status(201).json({ user,token });
  });

  // send otp
router.post('/send-otp/:id', async (req, res) => {
  const userId = req.params.id;
  const phone = req.body.phone;
   // check if id is type objectId
   if (!(userId.match(/^[0-9a-fA-F]{24}$/))) return res.status(400).json({ error: 'invalid user id' });
  // validate phone
  const { error } = validatePhone(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try{
    // gen otp of 4 digits
    //var result = Math.floor(1000 + Math.random() * 9000);
    //const sms_code = '' + result;
    const sms_code = 5000;
    // check if otp exists
    const prevOtp = await Otp.findOne({ userId: userId })
    if(prevOtp) {
      console.log('updating');
      //update
      const otpUpdated = await Otp.updateOne({ userId: userId }, {
        $set: { otp: sms_code },
      });
      // send sms to user
      var result = await sendSms(sms_code,phone);
      // store sms for billing
      var user = await User.findOne({ _id: userId });
      const sms = new Sms({
        recipient: user.email,
        sms: sms_code,
      });
      await sms.save();
      //return res
      return res.status(201).json({otp:sms_code});
    }else {
      // create new
      const otp = new Otp({
        userId: userId,
        otp: sms_code,
      });
      const savedOtp = await otp.save();
       // send sms to user
      var result = await sendSms(sms_code,phone);
      // store sms for billing
      var user = await User.findOne({ _id: userId });
      const sms = new Sms({
        recipient: user.email,
        sms: sms_code,
      });
      await sms.save();
       //return res
      return res.status(201).json({otp:sms_code});
    }
  } catch(error) {
    res.status(400).json({ error: 'something went wrong ' + error });
  }
})  

/// verify otp
router.post('/verify-otp/:id',async (req, res) => {
  const otp = req.body.otp;
  const userId = req.params.id;
   // check if id is type objectId
  if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) return res.status(400).json({ error: 'invalid user id' });
  try{
    // check if otp is correct
    const savedOtp = await Otp.findOne({userId: userId});
    if(!savedOtp)  return res.status(400).json({ error: 'timed out' });
    if(otp != savedOtp.otp) return res.status(400).json({ error: 'invalid OTP' });
    // update user
    await User.updateOne({ _id: userId }, {
      $set: { isphoneVerified: true },
    });
    return res.status(200).json({ status:"success" });
  }catch(error){
    
    res.status(400).json({ error: 'something went wrong ' + error });
  }

})

/// check phone nmb to send otp 4 change pass
router.get('/check-phone/:phone', async (req, res) => {
  try{
    // validt phon
    const { error } = validatePhone(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const phone = req.params.phone;
    const user = await User.findOne({ phone: phone });
    if (!user) return res.status(400).json({ error: 'user not found' });
    // retn sucss
    return res.status(200).json({ status:"success", user });
  }catch(error){
    res.status(400).json({ error: 'something went wrong ' + error });
  }
})

/// change pass
router.post('/change-password/:id', async (req, res) => {
  // validate details
  const { error } = validateChangePass(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  // check if user exists
  const userId = req.params.id;
  const newPass = req.body.password;
  if (!(userId.match(/^[0-9a-fA-F]{24}$/))) return res.status(400).json({ error: 'invalid user id' });
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ error: 'user not found' });
    // hashing new password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(newPass, salt);
    // update user
    const updated = await User.updateOne({ _id: userId }, {
      $set: { password: hashedPassword },
    });
    return res.status(201).json({status: 'success'});
  } catch (error) {
    return res.status(400).json({ error });
  }
});

 

/// send sms
async function sendSms(message,phone) {
  const sms_url = 'https://apisms.beem.africa/v1/send';
  const source_addr = process.env.SMS_SOURCE_ADDR;
  const dest_addr = phone;
  const api_key = process.env.SMS_API_KEY;
  const secret_key = process.env.SMS_SECRET_KEY;
  const content_type = "application/json";
  var result = await axios.post(sms_url, 
    {
      source_addr: source_addr,
      schedule_time: "",
      encoding: 0,
      message: message,
      recipients: [
        {
          recipient_id: 1,
          dest_addr: dest_addr,
        },
      ],
    },
    {
      headers: {
        "Content-Type": content_type,
        Authorization: "Basic " + Buffer.from(api_key + ":" + secret_key).toString('base64'),
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }
  )
  return result;
}

export default router;
  