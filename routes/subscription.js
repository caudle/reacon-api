import express from 'express';

import Subscription from '../models/subscription.js';

const router = express.Router();

// get all subs
router.get('/', async (req, res) => {
    try {
      const subs = await Subscription.find();
      // return them
      return res.status(200).json(subs);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  });

  // add cats
  router.post('/', async (req, res) => {
     // check if id is type objectId
   if (!(req.body.userId.match(/^[0-9a-fA-F]{24}$/))) return res.status(400).json({ error: 'invalid user id' });
    try {
      // create sub model
      const sub = new Subscription({
        userId: req.body.userId,
        status: req.body.status,
        amount: req.body.amount,
      });
      // save
      const savedSub = await sub.save();
      // return it
      return res.status(201).json(savedSub.toObject());
    } catch (error) {
      return res.status(400).json({ error });
    }
  });


  export default router;;