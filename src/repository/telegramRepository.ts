import mongoose from 'mongoose';
import { TelegramMessage, TelegramUser } from '../models/telegram'; // Adjust path as needed

export async function storeTelegramPayload(payload: any) {
    console.log(payload);
    try {
        if (payload.update_id && payload.message) { // Typical Telegram message update check
            await handleTelegramMessageEvent(payload.message);
        } else {
            console.log('Unhandled Telegram payload type:', payload);
        }
    } catch (error) {
        console.error('Error processing Telegram payload:', error);
    }
}

async function handleTelegramMessageEvent(message: any) {
    const existingMessage = await TelegramMessage.findOne({ _id: message.message_id });

    if (existingMessage) {
        console.log('Message with this ID already exists');
        return;
    }
    const user = await TelegramUser.findOneAndUpdate(
        { _id: message.from.id },
        {
            _id: message.from.id,
            is_bot: message.from.is_bot,
            first_name: message.from.first_name,
            username: message.from.username,
            language_code: message.from.language_code,
            type: message.chat.type
        },
        { upsert: true, new: true }
    );

    await storeTelegramMessageData(
        message.message_id,
        user._id,
        {
            type: 'text',
            text: message.text
        },
        'incoming',
        'message'
    );
}

export async function storeTelegramMessageData(
    message_id: number,
    userId: number,
    message: any,
    direction: string,
    status: string
) {
    const newMessageData = {
        _id: message_id,
        date: new Date().getTime(),
        userId,
        message,
        direction,
        status,
    };

    const newMessage = new TelegramMessage(newMessageData);
    await newMessage.save();
    console.log('Telegram message stored successfully');
}
