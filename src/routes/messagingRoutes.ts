// messagingRoutes.ts

import express from 'express';
import * as telegramService from '../services/telegramService';
import * as messengerService from '../services/messengerService';
import * as viberService from '../services/viberService';
import getActionFromBody from '../utils/getActionFromBody';
import { getSocketIo } from '../socketManager';  // Update the path accordingly
import storeData from '../utils/storeData';
import { storeViberPayload } from '../repository/viberRepository';

const router = express.Router();

const handleAndEchoMessage = async (
    serviceFunction: Function,
    receiverId: string,
    action: any,
    res: express.Response
) => {
    try {
        serviceFunction(receiverId, action);
        const io = getSocketIo();
        io.emit('message', { receiverId, action });
        res.send({ success: true });
    } catch (error: any) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

router.post('/viber', async (req, res) => {
    // storeData(req.body, 'viber_payload.json');
    // console.log(req.body)
    await storeViberPayload(req.body);
    if (req.body.event === 'message') {
        const receiverId = req.body.sender.id;
        const action = getActionFromBody(req.body, 'viber');

        if (action) {
            handleAndEchoMessage(viberService.sendViberMessage, receiverId, action, res);
        } else {
            res.status(400).send({ error: 'Unsupported or undefined Viber message type' });
        }
    } else {
        res.send({ success: true });
    }
});



router.post('/telegram', (req, res) => {
    // storeData(req.body, 'telegram_payload.json');
    console.log(req.body)
    if (!req.body.message) {
        return res.status(400).send('Invalid Telegram request');
    }

    const receiverId = req.body.message.chat.id;
    const action = getActionFromBody(req.body, 'telegram');

    if (action) {
        handleAndEchoMessage(telegramService.sendTelegramMessage, receiverId, action, res);
    } else {
        console.log('Unsupported or undefined message type from Telegram');
        res.sendStatus(400);
    }
});


router.post('/meta', (req, res) => {
    storeData(req.body, 'telegram_payload.json');
    if (!req.body.entry || !Array.isArray(req.body.entry)) {
        console.log('Malformed request body: missing or invalid entry field');
        res.sendStatus(400);
        return;
    }

    // Iterating through each entry
    for (const entry of req.body.entry) {
        if (!entry.messaging || !Array.isArray(entry.messaging)) {
            console.log('Malformed entry: missing or invalid messaging field');
            continue;
        }

        // Iterating through each messaging event
        for (const messagingEvent of entry.messaging) {
            if (!messagingEvent.sender || !messagingEvent.sender.id) {
                console.log('Malformed messaging event: missing sender.id field');
                continue;
            }

            const receiverId = messagingEvent.sender.id;
            const action = getActionFromBody(messagingEvent, 'messenger');

            if (action) {
                handleAndEchoMessage(messengerService.sendMessengerMessage, receiverId, action, res);
            } else {
                console.log('Unsupported or undefined message type from Messenger');
                res.sendStatus(400);  // You may want to change this to 'continue;' if you expect multiple messaging events
            }
        }
    }

    res.sendStatus(200);  // Respond with a success status once all entries and messaging events have been processed
});

const VERIFY_TOKEN = "813b544ce2653baa0a54d704a36d3a47";
router.get('/meta', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

export default router;
