
function translateViberPayload(payload: any): any {
    // This is the base structure
    let translatedMessage: any = {
        receiver: payload.sender.id,
        min_api_version: 1,
        sender: {
            name: 'Sender'
        },
        type: payload.message.type
    };

    switch (payload.message.type) {
        case 'text':
            translatedMessage.text = payload.message.text;
            break;
        case 'picture':
            translatedMessage.media = payload.message.media;
            translatedMessage.thumbnail = payload.message.thumbnail;
            break;
        // ... add cases for other message types as needed ...
        default:
            console.log(`Unsupported Viber message type: ${payload.message.type}`);
    }

    return translatedMessage;
}



function translateTelegramPayload(payload: any): any {
    let action: any = {};

    if (payload.message) {
        if (payload.message.text) {
            action.type = 'text';
            action.content = { text: payload.message.text };
        }
    }
    return action;
}
type Action = {
    senderId: string;
    recipientId: string;
    type: string;
    content: {
        text?: string;
        url?: string;
        mediaType?: string;
        replyTo?: string;
    };
}

function translateMessengerPayload(payload: any): Action | null {
    const messaging = payload.messaging && payload.messaging[0];
    if (!messaging) return null;

    const action: Action = {
        senderId: messaging.sender.id,
        recipientId: messaging.recipient.id,
        type: '',
        content: {}
    };

    // For text message
    if (messaging.message.text) {
        action.type = 'text';
        action.content.text = messaging.message.text;

        // Check for reply
        if (messaging.message.reply_to) {
            action.content.replyTo = messaging.message.reply_to.mid;
        }
    }

    // For media attachments
    else if (messaging.message.attachments) {
        const attachment = messaging.message.attachments[0]; // Taking the first attachment for simplicity
        action.type = attachment.type;
        action.content.url = attachment.payload.url;
        action.content.mediaType = attachment.type;
    }

    return action;
}
