import express from 'express';
import multer from 'multer';
import fs from'fs';
import path from'path';

import Listing from '../models/listing.js'
import Subcategory from '../models/subcategory.js';
import User from '../models/user.js';
import { validateListing } from '../middlewares/validation.js';

const router = express.Router();
const __dirname = path.resolve();

/// handle images
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/listing')
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
    fileSize: 5 * 1024 * 1024
}
});

// get all listings
router.get('/', async (req, res) => {
    try {
      const listings = await Listing.find();
      // return listings
      return res.status(200).json(listings);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // get listings by cat
  router.get('/:cat/', async (req, res) => {
      try {
        const listings = await Listing.find({category : req.params.cat});
        // return listings
        return res.status(200).json(listings);
      } catch (error) {
        res.status(400).json({ error });
      }
    });  

/// add listing
router.post('/' , async (req, res) => {
  console.log('adding listing');
   // validate details
  const { error } = validateListing(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try { 
  var listing = new Listing({
    name: req.body.name,
    category: req.body.category,
    nature: req.body.nature,
    hostId: req.body.hostId,
    baths: req.body.baths,
    beds:req.body.beds,
    size: req.body.size,
    address: req.body.address,
    amenities:req.body.amenities,
    furnished: req.body.furnished,
    pets: req.body.pets,
    price: req.body.price,
    negotiable: req.body.negotiable,
    description: req.body.description,
    dalaliFee: req.body.dalaliFee,
    duration: req.body.duration,
  });
  /// save
  var saved = await listing.save();
  console.log('added');
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
    //update listing
    const updated = await Listing.updateOne({ _id: req.params.id }, {
      $set: { photos: photos },
    });
    // return it
    return res.status(201).json("success");
    
  } catch (error) {
    return res.status(400).json({ error });
  }
});



/// cats
// get all listingcats
router.get('/categories', async (req, res) => {
  try {
    const categories = await Subcategory.find({category: "home"});
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
    const category = new Subcategory({
      category: "home",
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
    const listings = await Listing.find({
      $and: [
        { category: req.body.category },
        { _id: { $ne: req.body.id } },
      ],
    }).limit(6);
    console.log("listings: " + listings);
    // return
    return res.status(200).json(listings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});


// export
export default router;