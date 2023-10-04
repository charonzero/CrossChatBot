// type SourceType = 'viber' | 'telegram' | 'messenger';

// export default function getActionFromBody(payload: any, type: SourceType): any {
//     let action;

//     switch (type) {
//         case 'viber':
//             switch (payload.message.type) {
//                 case 'text':
//                     action = {
//                         type: 'text',
//                         content: {
//                             text: payload.message.text
//                         }
//                     };
//                     break;
//                 case 'picture':
//                     action = {
//                         type: 'picture',
//                         content: {
//                             text: payload.message.text,
//                             media: payload.message.media,
//                             thumbnail: payload.message.thumbnail
//                         }
//                     };
//                     break;
//                 // ... add cases for other Viber message types as needed ...
//                 default:
//                     console.log(`Unsupported Viber message type: ${payload.message.type}`);
//                     action = null;
//             }
//             break;

//         case 'telegram':
//             if (payload.message.text) {
//                 action = {
//                     type: 'text',
//                     content: {
//                         text: payload.message.text
//                     }
//                 };
//             } else if (payload.message.photo) {
//                 action = {
//                     type: 'image',
//                     content: {
//                         url: payload.message.photo[0].file_id // Using the first image for simplicity
//                     }
//                 };
//             }
//             // ... add conditions for other Telegram message types if needed ...
//             break;

//         case 'messenger':
//             if (payload.message.text) {
//                 action = {
//                     type: 'text',
//                     content: {
//                         text: payload.message.text
//                     }
//                 };
//             } else if (payload.message.attachments) {  // Assuming payload.message.attachments is an array
//                 const attachment = payload.message.attachments[0];  // Using the first attachment for simplicity
//                 switch (attachment.type) {
//                     case 'image':
//                         action = {
//                             type: 'image',
//                             content: {
//                                 url: attachment.payload.url  // Assuming attachment.payload.url contains the image URL
//                             }
//                         };
//                         break;
//                     case 'file':
//                         action = {
//                             type: 'file',
//                             content: {
//                                 url: attachment.payload.url  // Assuming attachment.payload.url contains the file URL
//                             }
//                         };
//                         break;
//                     // ... add cases for other attachment types as needed ...
//                     default:
//                         console.log(`Unsupported Messenger attachment type: ${attachment.type}`);
//                         action = null;
//                 }
//             } else {
//                 console.log('Unsupported or undefined message type from Messenger');
//                 action = null;
//             }
//             break;

//         default:
//             console.log(`Unsupported platform type: ${type}`);
//             action = null;
//     }

//     return action;
// }
