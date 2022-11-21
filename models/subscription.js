import mongoose from 'mongoose';

// create listing schema
const subscriptionSchema = mongoose.Schema({
    userId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    status: {
      type: Boolean,
      default: false,   // subs or not
    },
    amount: {
        type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
        type: Date,
        required: false,
    },
    
  
  });
  export default mongoose.model('Subscription', subscriptionSchema);