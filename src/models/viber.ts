import mongoose from 'mongoose';

const ViberUserSchema = new mongoose.Schema({
  _id: String,
  name: String,
  avatar: String,
  country: String,
  language: String,
  api_version: Number,
});

const ViberMessageContentSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'picture'], required: true },
  text: String,
  media: String,
  thumbnail: String,
  file_name: String,
  size: Number
}, { _id: false });

const ViberMessageSchema = new mongoose.Schema({
  _id: String,
  timestamp: Number,
  message_token: Number,
  userId: { type: String, ref: 'ViberUser', required: true },
  message: { type: ViberMessageContentSchema, required: true },
  direction: { type: String, enum: ['incoming', 'outgoing', 'bot'] },
  status: { type: String, enum: ['message', 'delivered', 'seen', 'deleted', 'sending', 'failed'], default: 'message' }
});

const ViberUser = mongoose.model('ViberUser', ViberUserSchema);
const ViberMessage = mongoose.model('ViberMessage', ViberMessageSchema);

export { ViberUser, ViberMessage };
