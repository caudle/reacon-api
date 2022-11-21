import mongoose from 'mongoose';

// create listing schema
const otpSchema = mongoose.Schema({
    userId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      expires: 60,
      default: Date.now,
    },
  
  });
  export default mongoose.model('Otp', otpSchema);
  