import Message from '../models/Message';

export const saveMessage = async (senderType: string, platform: string, content: string, receiverId: string) => {
  const message = new Message({
    senderType,
    platform,
    content,
    receiverId,
  });
  await message.save();
};
