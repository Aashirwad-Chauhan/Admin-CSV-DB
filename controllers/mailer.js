import {List} from '../models/List.js';
import {User} from '../models/User.js';
import csv from 'csv-parser';
import fs from 'fs';
import ErrorHandler from '../middlewares/error.js';
import mongoose from 'mongoose';
import { sendEmail } from '../utils/emailService.js';
import { personalizeEmail } from '../utils/personalizeEmail.js';


export const createList = async (req, res, next) => {
    try {
        const list = await List.create(req.body);
        res.status(201).json({ success: true, data: list });
    } catch (error) {
        next(error);
    }
};

export const addUserFromCSV = async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler('No file uploaded', 400));
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { listId } = req.params;
        const list = await List.findById(listId).session(session);
        if (!list) {
            throw new ErrorHandler('List not found', 404);
        }

        const results = [];
        const errors = [];
        const filePath = req.file.path;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('error', (error) => {
                throw new ErrorHandler(`Error reading CSV file: ${error.message}`, 500);
            })
            .on('data', (data) => {
                if (!data.email || !data.name) {
                    errors.push({ email: data.email, error: 'Missing required fields' });
                } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
                    errors.push({ email: data.email, error: 'Invalid email format' });
                } else {
                    results.push(data);
                }
            })
            .on('end', async () => {
                try {
                    const emails = results.map(user => user.email);
                    const existingUsers = await User.find({ email: { $in: emails } }).session(session);
                    const existingEmails = new Set(existingUsers.map(user => user.email));

                    const usersToAdd = [];
                    results.forEach(user => {
                        if (existingEmails.has(user.email)) {
                            errors.push({ email: user.email, error: 'Email already exists' });
                        } else {
                            const customProps = {};
                            list.customProperties.forEach(prop => {
                                customProps[prop.title] = user[prop.title] || prop.defaultValue;
                            });
                            const newUser = new User({ ...user, customProperties: customProps });
                            usersToAdd.push(newUser);
                            list.users.push(newUser);  // Add user to the list
                        }
                    });

                    if (usersToAdd.length > 0) {
                        await User.insertMany(usersToAdd, { session: session });
                        await list.save({ session: session });  // Save the list with the new users
                    }

                    await session.commitTransaction();
                    res.status(201).json({
                        success: true,
                        message: 'CSV processed',
                        usersAdded: usersToAdd.length,
                        usersFailed: errors.length,
                        errors: errors
                    });
                } catch (error) {
                    throw error;
                } finally {
                    session.endSession();
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Error deleting file ${filePath}: ${err}`);
                    });
                }
            });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const getListUsers = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const list = await List.findById(listId).populate('users');  

        if (!list) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        res.status(200).json({ success: true, users: list.users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendEmailToList = async (req, res) => {
    const { listId } = req.params;
    const { subject, body } = req.body;  

    try {
        const list = await List.findById(listId).populate('users');
        if (!list) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        const emailPromises = list.users.filter(user => !user.unsubscribed).map(user => {
            const personalizedBody = personalizeEmail(body, user);
            return sendEmail(user.email, subject, personalizedBody);
        });

        await Promise.all(emailPromises);

        res.status(200).json({ success: true, message: 'All emails have been sent successfully.' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ success: false, message: 'Failed to send emails.' });
    }
};

export const unsubscribeUser = async (req, res) => {
    const { userId } = req.params;

    try {
        await User.findByIdAndUpdate(userId, { unsubscribed: true });
        res.status(200).json({ success: true, message: 'You have been unsubscribed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};