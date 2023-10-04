import mongoose from 'mongoose';

// User Schema for Telegram
const TelegramUserSchema = new mongoose.Schema({
  _id: Number,
  is_bot: Boolean,
  first_name: String,
  username: String,
  language_code: String,
  type: { type: String, enum: ['private', 'group', 'channel'] }
});

// Photo Schema for Telegram messages that include photos
const TelegramPhotoSchema = new mongoose.Schema({
  file_id: String,
  file_unique_id: String,
  file_size: Number,
  width: Number,
  height: Number
}, { _id: false });

// Message Content Schema for Telegram
const TelegramMessageContentSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'photo'], required: true },
  text: String,
  photo: [TelegramPhotoSchema]
}, { _id: false });

// Message Schema for Telegram
const TelegramMessageSchema = new mongoose.Schema({
  _id: Number,
  date: Number,
  userId: { type: Number, ref: 'TelegramUser', required: true },
  message: { type: TelegramMessageContentSchema, required: true },
  direction: { type: String, enum: ['incoming', 'outgoing', 'bot'] },
  status: { type: String, enum: ['message', 'delivered', 'seen', 'deleted'], default: 'message' }
});

module.exports = mongoose.model('TelegramUser', TelegramUserSchema);
module.exports = mongoose.model('TelegramMessage', TelegramMessageSchema);
