import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderType: {
    type: String,
    required: true,
    enum: ['user', 'bot', 'admin'],
  },
  platform: {
    type: String,
    enum: ['telegram', 'messenger', 'viber'],
  },
  content: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;
