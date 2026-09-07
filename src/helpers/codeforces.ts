import cron from 'node-cron';
import { User } from '../models/user.model.js';


export const fetchCodeforcesData = async (handle: string) => {
    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const data = await response.json();

        if (data.status === "FAILED") {
            return {
                isValid: false, 
                message: "Handle doesn't exist"
            };
        }

        const userInfo = data.result[0];
        
        return {
            isValid: true,
            rating: userInfo.rating || 0,
            rank: userInfo.rank || "unrated",
        };
    } catch (error) {
        console.error("Codeforces API Error:", error);
        return { 
            isValid: false, 
            message: "Codeforces Server Error"
        };
    }
};


export const scheduleCodeforcesUpdate = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('⏳ جاري تحديث تقييمات Codeforces لكل المستخدمين...');

        try {
            
            const usersWithCf = await User.find({ codeforcesHandle: { $exists: true, $ne: "" } });
            
            if (usersWithCf.length === 0) {
                console.log('مفيش مستخدمين عندهم هاندل كودفورسيز للتحديث.');
                return;
            }

            const handlesArray = usersWithCf.map(user => user.codeforcesHandle);
            const handlesString = handlesArray.join(';');

            const response = await fetch(`https://codeforces.com/api/user.info?handles=${handlesString}`);
            const data = await response.json();

            if (data.status === 'OK') {
                const results = data.result;

                const bulkOps = results.map((cfUser: any) => ({
                    updateOne: {
                        filter: { codeforcesHandle: cfUser.handle },
                        update: { 
                            codeforcesRating: cfUser.rating || 0,
                            codeforcesRank: cfUser.rank || 'unrated'
                        }
                    }
                }));

                await User.bulkWrite(bulkOps);
                console.log(`✅ تم تحديث تقييمات ${usersWithCf.length} مستخدم بنجاح!`);
            }
        } catch (error) {
            console.error('❌ خطأ أثناء تحديث تقييمات Codeforces:', error);
        }
    });
};