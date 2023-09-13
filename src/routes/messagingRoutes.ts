import express from 'express';
import * as telegramService from '../services/telegramService';
import * as messengerService from '../services/messengerService';
import * as viberService from '../services/viberService';
import getActionFromBody from '../models/getActionFromBody';

const router = express.Router();
const handleAndEchoMessage = async (
    serviceFunction: Function,
    receiverId: string,
    action: any,
    res: express.Response
) => {
    try {
        await serviceFunction(receiverId, action);
        res.send({ success: true });
    } catch (error: any) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

router.post('/viber', (req, res) => {
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


router.post('/messenger', (req, res) => {
    console.log('Incoming data from Messenger:', req.body);
    const receiverId = req.body.sender.id;
    const action = getActionFromBody(req.body, 'messenger');
    if (action) {
        handleAndEchoMessage(messengerService.sendMessengerMessage, receiverId, action, res);
    } else {
        console.log('Unsupported or undefined message type from Messenger');
        res.sendStatus(400);
    }
});

export default router;
