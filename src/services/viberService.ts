import { ViberClient } from 'messaging-api-viber';
import dotenv from 'dotenv';

try {
  dotenv.config(); // Load environment variables from .env
} catch (error) {
  console.error('Error loading .env file in service:', error);
}
const client = new ViberClient({
  accessToken: process.env.VIBER_ACCESS_TOKEN || 'Error',
  sender: {
    name: 'Sender',
  },
});
client.setWebhook(process.env.NGROK_URL + '/api/viber');

export const sendViberMessage = async (receiverId: string, action: any) => {

  try {
    let result;
    switch (action.type) {
      case 'text':
        result = await client.sendMessage(receiverId, {
          type: 'text',
          text: action.content.text,
          sender: {
            name: 'Sender',
          }
        });
        break;

      case 'image':
        result = await client.sendMessage(receiverId, {
          type: 'picture',
          text: action.content.caption || '',
          media: action.content.url,
          sender: {
            name: 'Sender',
          }
        });
        break;

      case 'audio':
        result = await client.sendMessage(receiverId, {
          type: 'file',
          media: action.content.url,
          size: 0, // You might need the actual file size here
          fileName: 'audiofile.ext', // You might need the actual filename here
          sender: {
            name: 'Sender',
          }
        });
        break;

      case 'video':
        result = await client.sendMessage(receiverId, {
          type: 'video',
          media: action.content.url,
          size: 0, // You might need the actual file size here
          sender: {
            name: 'Sender',
          }
        });
        break;

      default:
        console.log(`Unsupported Viber message type: ${action.type}`);
    }
    console.log(result);
  } catch (error: any) {
    console.error(`Error sending Viber message: ${error.message}`);
  }
};
