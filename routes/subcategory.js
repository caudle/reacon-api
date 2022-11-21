import express from 'express';

import Subcategory from '../models/subcategory.js';

const router = express.Router();

// get all cats
router.get('/', async (req, res) => {
    try {
      const subcategories = await Subcategory.find();
      // return them
      return res.status(200).json(subcategories);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  });
  

  ///export
  export default router;
  