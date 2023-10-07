import { ViberClient } from 'messaging-api-viber';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ViberMessage } from '../models/viber';
import { Message } from 'messaging-api-viber/dist/ViberTypes';
import { storeViberMessageData } from '../repository/viberRepository';

try {
  dotenv.config();
} catch (error) {
  console.error('Error loading .env file in service:', error);
}

const client = new ViberClient({
  accessToken: process.env.VIBER_ACCESS_TOKEN || 'Error',
  sender: {
    name: 'NEC Chat',
  },
});
client.setWebhook(process.env.NGROK_URL + '/api/viber');

export const sendViberMessage = async (receiverId: string, action: any) => {
  try {
    let result;
    let messageType;
    let messageContent = {};
    let sentMessageData;
    const SenderName = "NEC Bot";

    switch (action.type) {
      case 'text':
        messageType = 'text';
        messageContent = {
          type: messageType,
          text: action.content.text,
          sender: {
            name: SenderName,
          }
        };
        result = await client.sendMessage(receiverId, messageContent as Message);
        break;

      case 'image':
        messageType = 'picture';
        messageContent = {
          type: messageType,
          text: action.content.caption || '',
          media: action.content.url,
          sender: {
            name: SenderName,
          }
        };
        result = await client.sendMessage(receiverId, messageContent as Message);
        break;

      case 'audio':
        messageType = 'audio';
        messageContent = {
          type: 'file',
          media: action.content.url,
          size: 0,
          fileName: 'audiofile.ext',
          sender: {
            name: SenderName,
          }
        };
        result = await client.sendMessage(receiverId, messageContent as Message);
        break;

      case 'video':
        messageType = 'video';
        messageContent = {
          type: messageType,
          media: action.content.url,
          size: 0,
          sender: {
            name: SenderName,
          }
        };
        result = await client.sendMessage(receiverId, messageContent as Message);
        break;

      default:
        console.log(`Unsupported Viber message type: ${action.type}`);
        return;
    }

    await storeViberMessageData(
      result.messageToken,
      receiverId,
      messageContent,
      'outgoing',
      'sending'
    );
    console.log('Outgoing Viber message stored successfully');

    console.log(result);
  } catch (error: any) {
    console.error(`Error sending Viber message: ${error.message}`);
  }
};


