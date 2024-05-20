import express from 'express';
import { unsubscribeUser } from '../controllers/mailer.js';

const router = express.Router();

router.get('/info/:userId/unsubscribe', unsubscribeUser);

export default router;