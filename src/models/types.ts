export type ActionType = 'text' | 'image' | 'url' | 'contact' | 'file' | 'location' | 'video' | 'sticker' | 'richmedia' | 'keyboard';

export interface Button {
  text: string;
  action: string;
  columns: number;
  rows: number;
  actionBody?: string;
}

export interface MessageContent {
  type: ActionType;
  content: {
    text?: string;
    url?: string;
    name?: string;
    phoneNumber?: string;
    size?: number;
    fileName?: string;
    latitude?: number;
    longitude?: number;
    duration?: number;
    thumbnail?: string;
    stickerId?: string;
    richMediaObject?: any; // Define the structure for this if it's consistent.
    buttons?: Button[];
  };
}
