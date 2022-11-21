import mongoose from 'mongoose';

// create listing schema
const listingSchema = mongoose.Schema({
  type: {
    type:String,
    default: 'home',
  },
  title: {
    type:String,
  },
  category: {
    type: String, // eg apt,house
  },
  nature: {
    type: String, // eg rent,sale
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  baths: {
    type: Number,
    defaul: 0,
  },
  beds: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,

  },
  address: {
    type: String,
  },
  amenities: [String],
  furnished: {
    type: Boolean,
    default: false,
  },
  pets: {
    type: Boolean,
    default: false,
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
  duration: {
    type: String, //per month, per quarter, per half year, per year
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});
export default mongoose.model('Listing', listingSchema);
