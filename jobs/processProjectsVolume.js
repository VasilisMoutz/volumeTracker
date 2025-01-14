import schedule from 'node-schedule';
import Project from '../models/Project.js';

export const scheduleProjectsJob = () => {

  // Volume reseting

  // Daily 00:00
  schedule.scheduleJob('0 0 * * *', async function(){ 
    try {
      await Project.updateMany({ dailyVol: { $ne: 0 } }, { dailyVol: 0 });
      console.log('Daily Update successful')
    } catch (error) {
      console.log('Error occured attempting daily update: ', error);
    }  
  })

  // Sunday 00:00
  schedule.scheduleJob('0 0 * * 0', async function () {
    try {
      await Project.updateMany({ weeklyVol: { $ne: 0 } }, { weeklyVol: 0 });
    } catch (error) {
      console.log('Error occured attempting weekly update: ', error);
    }
  })

  // Monthly
  schedule.scheduleJob('0 0 1 * *', async function () {
    try {
      await Project.updateMany({ monthlyVol: { $ne: 0 } }, { monthlyVol: 0 });
    } catch (error) {
      console.log('Error occured attempting weekly update: ', error);
    }
  })

  // Yearly
  schedule.scheduleJob('0 0 1 1 *', async function () {
    try {
      await Project.updateMany({ yearlyVol: { $ne: 0 } }, { yearlyVol: 0 });
    } catch (error) {
      console.log('Error occured attempting yearly update: ', error);
    }
  })
}
