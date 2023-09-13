import { MessengerClient } from 'messaging-api-messenger';
import dotenv from 'dotenv';

try {
  dotenv.config(); // Load environment variables from .env
} catch (error) {
  console.error('Error loading .env file in service:', error);
}
const client = new MessengerClient({
  accessToken: process.env.MESSENGER_ACCESS_TOKEN || '',
  appId: process.env.MESSENGER_APP_ID,
  appSecret: process.env.MESSENGER_APP_SECRET,
});

export const sendMessengerMessage = async (receiverId: string, message: any) => {
  switch (message.type) {
    case 'text':
      return client.sendText(receiverId, message.content.text);

    case 'image':
      return client.sendImage(receiverId, message.content.url);

    case 'audio':
      return client.sendAudio(receiverId, message.content.url);

    case 'video':
      return client.sendVideo(receiverId, message.content.url);

    case 'file':
      return client.sendFile(receiverId, message.content.url);

    case 'url':
      // If you specifically want to send a URL as text:
      return client.sendText(receiverId, message.content.url);

    case 'contact':
      // Representing contact as a text as Messenger doesn't have a specific type for this:
      return client.sendText(receiverId, `${message.content.name}, ${message.content.phoneNumber}`);

    case 'location':
      // Representing location as a text as Messenger doesn't have a specific type for this:
      return client.sendText(receiverId, `Location: ${message.content.latitude}, ${message.content.longitude}`);

    case 'sticker':
      return client.sendImage(receiverId, message.content.stickerId); // Assuming stickerId is a URL.

    case 'richmedia':
      const elements = message.content.map((item: any) => ({
        title: item.title,
        image_url: item.imageUrl,
        subtitle: item.subtitle,
        buttons: item.buttons.map((btn: any) => ({
          type: btn.type,
          title: btn.title,
          url: btn.type === 'web_url' ? btn.url : undefined,
          payload: btn.type === 'postback' ? btn.payload : undefined
        }))
      }));
      return client.sendGenericTemplate(receiverId, elements);

    case 'keyboard':
      const quickReplies = message.content.map((qr: any) => ({
        content_type: 'text',
        title: qr.title,
        payload: qr.payload
      }));
      return client.sendText(receiverId, 'Choose an option:', { quickReplies: quickReplies });

    default:
      throw new Error(`Unsupported message type: ${message.type}`);
  }
};
