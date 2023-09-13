import { TelegramClient } from 'messaging-api-telegram';
import dotenv from 'dotenv';

try {
  dotenv.config(); // Load environment variables from .env
} catch (error) {
  console.error('Error loading .env file in service:', error);
}
const telegramAccessToken = process.env.TELEGRAM_ACCESS_TOKEN || 'Error';
const client = new TelegramClient({
  accessToken: telegramAccessToken,
});
client.setWebhook(process.env.NGROK_URL + '/api/telegram');

export const sendTelegramMessage = async (receiverId: string, action: any) => {
  switch (action.type) {
    case 'text':
      await client.sendMessage(receiverId, action.content.text);
      break;

    case 'image':
      await client.sendPhoto(receiverId, action.content.url, {
        caption: action.content.caption || ''
      });
      break;

    case 'audio':
      await client.sendAudio(receiverId, action.content.url);
      break;

    case 'document':
      await client.sendDocument(receiverId, action.content.url);
      break;

    case 'sticker':
      await client.sendSticker(receiverId, action.content.url);
      break;

    case 'video':
      await client.sendVideo(receiverId, action.content.url);
      break;

    case 'voice':
      await client.sendVoice(receiverId, action.content.url);
      break;

    case 'videoNote':
      await client.sendVideoNote(receiverId, action.content.url);
      break;

    case 'mediaGroup':
      // Assuming action.content is an array of InputMedia.
      await client.sendMediaGroup(receiverId, action.content);
      break;

    case 'location':
      await client.sendLocation(receiverId, action.content.latitude, action.content.longitude);
      break;

    case 'venue':
      await client.sendVenue(receiverId, {
        latitude: action.content.latitude,
        longitude: action.content.longitude,
        title: action.content.title,
        address: action.content.address,
        foursquareId: action.content.foursquareId
      });
      break;

    case 'contact':
      await client.sendContact(
        receiverId,
        {
          phoneNumber: action.content.phoneNumber,
          firstName: action.content.firstName,
        },
        {
          lastName: action.content.lastName,
          vcard: action.content.vcard
        }
      );
      break;
    case 'chatAction':
      await client.sendChatAction(receiverId, action.content.action);
      break;

    default:
      console.log(`Unsupported message type: ${action.type}`);
  }
};
