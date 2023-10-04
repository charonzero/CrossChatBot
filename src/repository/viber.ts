import mongoose from 'mongoose';
import { ViberMessage, ViberUser } from '../models/viber';
export async function storePayload(payload: any) {
    try {
        switch (payload.event) {
            case 'message':
                await handleMessageEvent(payload, "incoming");
                break;
            case 'delivered':
                await handleStatusUpdate(payload, 'delivered');
                break;
            case 'seen':
                await handleStatusUpdate(payload, 'seen');
                break;
            case 'deleted':
                await handleStatusUpdate(payload, 'deleted');
                break;
            default:
                console.log('Unhandled event type:', payload.event);

        }

    } catch (error) {
        console.error('Error processing payload:', error);
    }
}

async function handleMessageEvent(payload: any, direction: string) {
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

    const newMessageData = {
        _id: new mongoose.Types.ObjectId(),
        timestamp: payload.timestamp,
        message_token: payload.message_token,
        userId: user._id,
        message: {
            type: payload.message.type,
            text: payload.message.text,
        },
        direction: direction,
        status: direction === "incoming" ? 'message' : 'some_other_value',

    };

    const newMessage = new ViberMessage(newMessageData);
    await newMessage.save();
    console.log('New message stored successfully');
}

async function handleStatusUpdate(payload: any, status: any) {
    const result = await ViberMessage.updateOne(
        { message_token: payload.message_token },
        { $set: { status } }
    );

    if (result.matchedCount > 0 && result.modifiedCount > 0) {
        console.log('Message status updated successfully');
    } else {
        console.log('No message found with this token, or the status was already updated');
    }
}

