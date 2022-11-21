import express from 'express';
import multer from 'multer';
import fs from'fs';
import path from'path';

import Seller from '../models/seller.js';

const router = express.Router();
const __dirname = path.resolve();

/// handle images
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/idcards')
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
});
const imageFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
  }
  callback(null, true);
};
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits:{
    fileSize: 1024 * 1024
}
});

// get all sellers
router.get('/', async (req, res) => {
    try {
      const sellers = await Seller.find();
      // return them
      return res.status(200).json(sellers);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  });
  
  // add seller 
  router.post('/', uploadImage.single('image'), async (req, res) => {
    // check if id is type objectId
   if (!(req.body.userId.match(/^[0-9a-fA-F]{24}$/))) return res.status(400).json({ error: 'invalid user id' });
    try {
        var img = {
            data: fs.readFileSync(path.join(__dirname + '/public/images/idcards/' + file.filename)),
            name: file.filename,
            contentType: file.mimetype,
        };
      // create seller model
      const seller = new Seller({
        userId: req.body.userId,
        idCard: img,
      });
      // save
      await category.save();
      // update user type
      await User.updateOne({ _id: req.body.userId }, {
        $set: { type: "pending" },
      });
      // return
      return res.status(201).json({status: "success"});
    } catch (error) {
      return res.status(400).json({ error });
    }
  });

  export default router;