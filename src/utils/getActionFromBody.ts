interface ViberPayload {
    event: string;
    timestamp: number;
    chat_hostname: string;
    message_token: number;
    sender: {
        id: string;
        name: string;
        avatar: string;
        language: string;
        country: string;
        api_version: number;
    };
    message: {
        text?: string;
        type?: string;
        media?: string;
        thumbnail?: string;
        file_name?: string;
        size?: number;
        sticker_id?: number;
    };
    silent: boolean;
    user_id?: string;
    udid?: any;
}

interface TelegramPayload {
    update_id: number;
    message: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
            language_code: string;
        };
        chat: {
            id: number;
            first_name: string;
            username: string;
            type: string;
        };
        date: number;
        text?: string;
        photo?: {
            file_id: string;
            file_unique_id: string;
            file_size: number;
            width: number;
            height: number;
        }[];
    };
}

interface MessengerPayload {
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message: {
        mid: string;
        text?: string;
        attachments?: {
            type: string;
            payload: {
                url?: string;
                product?: {
                    elements: Array<{
                        id: string;
                        retailer_id: string;
                        image_url: string;
                        title: string;
                        subtitle: string;
                    }>;
                };
            };
        }[];
        quick_reply?: { payload: string };
        reply_to?: { mid: string };
    };
}

type SourceType = 'viber' | 'telegram' | 'messenger';

type BotAction = {
    type: 'text' | 'image' | 'file' | 'product';
    content: any;
};

export default function getActionFromBody(payload: ViberPayload | TelegramPayload | MessengerPayload, type: SourceType): BotAction | null {
    let action: BotAction | null = null;

    switch (type) {
        case 'viber': {
            const message = payload as ViberPayload;
            if (message.message.text) {
                action = { type: 'text', content: { text: message.message.text } };
            } // ... handle other Viber message types as needed
            break;
        }
        case 'telegram': {
            const message = payload as TelegramPayload;
            if (message.message.text) {
                action = { type: 'text', content: { text: message.message.text } };
            } // ... handle other Telegram message types as needed
            break;
        }
        case 'messenger': {
            const message = payload as MessengerPayload;
            if (message.message.text) {
                action = { type: 'text', content: { text: message.message.text } };
            } // ... handle other Messenger message types as needed
            break;
        }
        default:
            console.log(`Unsupported platform type: ${type}`);
    }

    return action;
}
