import mongoose from 'mongoose';

// create land schema
const landSchema = mongoose.Schema({
    type: {
      type:String,
      default: 'land',
    },
    title: {
      type:String,
    },
    category: {
      type: String, // eg commercial,mixed,residential
    },
    nature: {
      type: String, // eg rent,sale
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    size: {
      type: Number, // in sqm
  
    },
    address: {
      type: String,
    },
    photos: [String],
    price: {
      type: Number,
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    dalaliFee: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  
  });
  export default mongoose.model('Land', landSchema);
  