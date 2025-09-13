import cron from 'node-cron';
import {subDays, format} from 'date-fns';
import { db } from '../config/db';  
import { sendAccountDeletionWarningEmail } from '../utils/email.util';  


cron.schedule("0 0 * * * ", async () => {
    console.log("Cron job is running to notify users of pending account deletion...");

    const thresholdDate = subDays(new Date(), 6); // user registered 6days ago
    const deletionDate = format(subDays(new Date(),1), 'yyyy-mm-dd'); // Deletion in one day

    try {
        const usersToNotify = await db.user.findMany({
            where:{
                emailVerified: false, // check if email is still unverified
                createdAt: {lt: thresholdDate},
            },
        });

        // loop through the users to send them personalized emails about account deletion deadline.
        for(const user of usersToNotify){
            await sendAccountDeletionWarningEmail({
                to:user.email,
                subject:"Your account will be verified soon kindly verify user email.",
                name: user.firstname + " " + user.lastname,
                deletionDate: deletionDate,
            });

             console.log(`Notification sent to ${user.email} `)
        }

       
    } catch (error) {
        console.log('Error occurred while sending notification email', error);
    }
})
