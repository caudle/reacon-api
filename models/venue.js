import mongoose from 'mongoose';

// create listing schema
const venueSchema = mongoose.Schema({
  type: {
    type:String,
    default: 'event',
  },
    title: {
      type:String,
    },
    category: {
      type: String, // eg wedding,multipurpose hall
    },
    nature: {
      type: String, // eg rent,sale
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    capacity: {
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
    duration: {
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
  export default mongoose.model('Venue', venueSchema);
  