import mongoose from 'mongoose';
import { ViberMessage, ViberUser } from '../models/viber';

export async function storeViberPayload(payload: any) {
    console.log(payload)
    try {
        switch (payload.event) {
            case 'message':
                await handleViberMessageEvent(payload, "incoming");
                break;
            case 'delivered':
                await handleViberStatusUpdate(payload, 'delivered');
                break;
            case 'seen':
                await handleViberStatusUpdate(payload, 'seen');
                break;
            case 'deleted':
                await handleViberStatusUpdate(payload, 'deleted');
                break;
            case 'webhook':
                console.log('Success: Viber connected!');
                break;
            default:
                console.log('Unhandled event type:', payload.event);
        }

    } catch (error) {
        console.error('Error processing Viber payload:', error);
    }
}

async function handleViberMessageEvent(payload: any, direction: string) {
    const existingMessage = await ViberMessage.findOne({ message_token: payload.message_token });

    if (existingMessage) {
        console.log('Message with this token already exists');
        return;
    }

    // Update or create user
    const user = await ViberUser.findOneAndUpdate(
        { _id: payload.sender.id },
        {
            _id: payload.sender.id,
            name: payload.sender.name,
            avatar: payload.sender.avatar,
            country: payload.sender.country,
            language: payload.sender.language,
            api_version: payload.sender.api_version
        },
        { upsert: true, new: true }
    );

    await storeViberMessageData(
        payload.message_token,
        user._id,
        {
            type: payload.message.type,
            text: payload.message.text,
        },
        direction,
        direction === "incoming" ? 'message' : 'delivered'
    );
}


async function handleViberStatusUpdate(payload: any, status: any) {
    const result = await ViberMessage.updateOne(
        { message_token: payload.message_token },
        { $set: { status } }
    );

    if (result.matchedCount > 0 && result.modifiedCount > 0) {
        console.log('Viber message status updated successfully');
    } else {
        console.log('No Viber message found with this token, or the status was already updated');
    }
}
export async function storeViberMessageData(
    message_token: number,
    userId: string,
    message: any,
    direction: string,
    status: string
) {
    const newMessageData = {
        _id: new mongoose.Types.ObjectId(),
        timestamp: new Date().getTime(),
        message_token,
        userId,
        message,
        direction,
        status,
    };

    const newMessage = new ViberMessage(newMessageData);
    await newMessage.save();
    console.log('Viber message stored successfully');
}
