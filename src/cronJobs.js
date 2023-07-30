// import { schedule } from 'node-cron';
const schedule = require('node-cron');
// schedule tasks to be run on the server
schedule('* * * * *', () => {
    console.log('Execute your service here...');
});

export default schedule;