import cron from 'node-cron';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Notification from '../models/notification.js';
import Family from '../models/family.js';
import Task from '../models/task.js';
import Bill from '../models/bill.js';

dotenv.config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function scheduleEmail() {
    // Schedule email to be sent at 8:29 PM every day
    cron.schedule('59 14 * * *', async function() { 
        
        try{

            // return notification with status except Complete and datelines tomorrow
            const notifications = await Notification.find({ status: { $in: ['Waiting', 'Sent', 'Failed'] }, typeDatelines: { $lte: new Date(new Date().setDate(new Date().getDate() + 1)) } })
                .populate('FamilyMembers', 'email')
                .populate('FamilyId');             
                
            //console.log('notifications: ', notifications);

            for (const notification of notifications) {

                const emailList = notification.FamilyEmails.join(',');

                if(!emailList){
                    console.log('No valid email addresses for notification:', notification._id);
                    continue;
                }

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: emailList,
                    subject: `Your ${notification.type} is due tomorrow!`,
                    text: `You have a ${notification.type} : ${notification.typeTitle}\n\nDue Date: ${notification.typeDatelines}`
                }

                transporter.sendMail(mailOptions, async function(error, info){
                    if (error){
                        console.log('Error Sending Email',notification._id, error);
                        notification.status = 'Failed';
                    } else {
                        console.log('Email sent:', info.response);
                        notification.status = 'Sent';

                        notification.sentAt = new Date();
                        notification.successfulAt = new Date();
                    }
                    await notification.save();
                })
            }

        } catch (err) {
            console.error('Error in sending email: ', err);
        }

    });
}

export { scheduleEmail };

