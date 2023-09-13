type SourceType = 'viber' | 'telegram' | 'messenger';

export default function getActionFromBody(payload: any, type: SourceType): any {
    let action;

    switch (type) {
        case 'viber':
            switch (payload.message.type) {
                case 'text':
                    action = {
                        type: 'text',
                        content: {
                            text: payload.message.text
                        }
                    };
                    break;
                case 'picture':
                    action = {
                        type: 'picture',
                        content: {
                            text: payload.message.text,
                            media: payload.message.media,
                            thumbnail: payload.message.thumbnail
                        }
                    };
                    break;
                // ... add cases for other Viber message types as needed ...
                default:
                    console.log(`Unsupported Viber message type: ${payload.message.type}`);
                    action = null;
            }
            break;

        case 'telegram':
            if (payload.message.text) {
                action = {
                    type: 'text',
                    content: {
                        text: payload.message.text
                    }
                };
            } else if (payload.message.photo) {
                action = {
                    type: 'image',
                    content: {
                        url: payload.message.photo[0].file_id // Using the first image for simplicity
                    }
                };
            }
            // ... add conditions for other Telegram message types if needed ...
            break;

        case 'messenger':
            if (payload.message.text) {
                action = {
                    type: 'text',
                    content: {
                        text: payload.message.text
                    }
                };
            }
            // ... add conditions for other Messenger message types if needed ...
            break;

        default:
            console.log(`Unsupported platform type: ${type}`);
            action = null;
    }

    return action;
}
