import express from 'express';

import Category from '../models/Category.js';

const router = express.Router();

// get all cats
router.get('/', async (req, res) => {
    try {
      const categories = await Category.find();
      // return them
      return res.status(200).json(categories);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  });
  
  // add cats
  
  router.post('/', async (req, res) => {
    try {
      // create cat model
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });
      // save
      const savedCategory = await category.save();
      // return it
      return res.status(201).json(savedCategory.toObject());
    } catch (error) {
      return res.status(400).json({ error });
    }
  });
  
  // update
  router.patch('/:id', async (req, res) => {
    try {
      await Category.updateOne({ _id: req.params.id }, {
        $set: {
          name: req.body.name,
          description: req.body.description,
        },
      });
      // get update cat
      const updatedCategory = await Category.findById(req.params.id);
      // return cat
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(400).json({ error });
    }
  });
  
  // delete
  router.delete('/:id', async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      await Category.deleteOne({ _id: req.params.id });
      return res.status(200).json('deleted');
    } catch (error) {
      return res.status(400).json({ error });
    }
  });

  ///export
  export default router;
  