import express from "express";
import { createList, addUserFromCSV, getListUsers, sendEmailToList, unsubscribeUser } from '../controllers/mailer.js';
import {singleUpload} from "../middlewares/multer.js";

const router = express.Router();

router.post("/lists", createList);
router.post("/lists/:listId/users", singleUpload, addUserFromCSV);
router.get("/lists/:listId/users", getListUsers);
router.post('/lists/:listId/send-email', sendEmailToList);


export default router;