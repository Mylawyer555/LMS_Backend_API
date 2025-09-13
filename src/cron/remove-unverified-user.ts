import cron from 'node-cron';
import {db} from '../config/db';
import {subDays} from 'date-fns';

const deleteUnverifiedUser = () => {
    const DELETE_UNVERIFIED_USERS_CRON = "0 0 * * * ";
    
    cron.schedule(DELETE_UNVERIFIED_USERS_CRON, async () => {
        console.log("Starting cron job: Deleting unverified users...")

        try {
            const thresholdDate = subDays(new Date(), 7);

            const deleteUsers = await db.user.deleteMany({
                where: {
                    emailVerified: false, //unverified emails
                    createdAt: {lt: thresholdDate}, // registered more than 7 days
                },
            });

            console.log(`Cron job completed: ${deleteUsers.count} unverified users deleted`)
        } catch (error) {
            console.log("Error running cron jobs to delete users", error);
        };
    });
};

export default deleteUnverifiedUser;