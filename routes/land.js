import express from 'express';
import multer from 'multer';
import fs from'fs';
import path from'path';

import Land from '../models/land.js'
import Subcategory from '../models/subcategory.js';

import { validateLand } from '../middlewares/validation.js';

const router = express.Router();
const __dirname = path.resolve(); 

/// handle images
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/land')
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
});
const imageFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
  }
  callback(null, true);
};
const uploadImages = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits:{
    fileSize: 10 * 1024 * 1024
}
});

// get all land and plots
router.get('/', async (req, res) => {
    try {
      const lands = await Land.find();    
      // return lands
      return res.status(200).json(lands);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

 // get lands by cat
 router.get('/:cat/', async (req, res) => {
  try {
    const lands = await Land.find({category : req.params.cat});
    // return lands
    return res.status(200).json(lands);
  } catch (error) {
    res.status(400).json({ error });
  }
});    

/// add land
router.post('/', async (req, res) => {
  console.log('adding land');
   // validate details
  const { error } = validateLand(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
  
  var land = new Land({
    title: req.body.title,
    category: req.body.category,
    nature: req.body.nature,
    hostId: req.body.hostId,
    size: req.body.size,
    address: req.body.address,
    price: req.body.price,
    negotiable: req.body.negotiable,
    description: req.body.description,
    dalaliFee: req.body.dalaliFee,
  });
  /// save
  var saved = await land.save();
  return res.status(201).json(saved._id);
  } catch (error) {
    console.log(error.data);
    res.status(400).json({ error });
  } 
})

// add images
router.post('/:id/images', uploadImages.array('photos', 6), async (req, res) => {
  if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) return res.status(400).json({ error: 'invalid user id' });
  try {
    const photos = []; 
    req.files.forEach((file) => {
      var img = file.path.replace(/\\/g, "/");
      photos.push(img);
    });
    //update land
    const updated = await Land.updateOne({ _id: req.params.id }, {
      $set: { photos: photos },
    });
    // return it
    return res.status(201).json("success");
    
  } catch (error) {
    return res.status(400).json({ error });
  }
});



/// cats
// get all landcats
router.get('/categories', async (req, res) => {
  try {
    const categories = await Subcategory.find({category: "land"});
    // return them
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

 // add cats
 router.post('/categories', async (req, res) => {
  try {
    // create listingcat model
    // create listingcat model
    const category = new Subcategory({
      category: "land",
      name: req.body.name,
    });
    // save
    const savedCategory = await category.save();
    // return it
    return res.status(201).json(savedCategory.toObject());
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// more like this
router.post('/more', async (req, res) => {
  if (!(req.body.id.match(/^[0-9a-fA-F]{24}$/))) return res.status(400).json({ error: 'invalid id' });
  try {
    console.log(req.body.id);
    console.log(req.body.category);
    const lands = await Land.find({
      $and: [
        { category: req.body.category },
        { _id: { $ne: req.body.id } },
      ],
    }).limit(6);
    console.log("lands: " + lands);
    // return
    return res.status(200).json(lands);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// export
export default router;