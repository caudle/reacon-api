import mongoose from 'mongoose';

// create listing schema
const smsSchema = mongoose.Schema({
    recipient:  {
        type: String,
      },
    sms: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  
  });
  export default mongoose.model('Sms', smsSchema);