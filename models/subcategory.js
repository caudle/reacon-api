import mongoose from 'mongoose';

const subcategorySchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model('Subcategory', subcategorySchema);