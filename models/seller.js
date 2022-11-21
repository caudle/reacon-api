import mongoose from 'mongoose';

// create seller schema
const sellerSchema = mongoose.Schema({
    userId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    idCard: {
        data: Buffer,
        name: String,
        contentType: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  
  });
  export default mongoose.model('Seller', sellerSchema);