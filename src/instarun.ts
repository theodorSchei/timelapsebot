import { PostToTwitter } from "./postToTwitter";

const Timelapse = require('./timelapse');
const Webhotel = require('./uploadToWebHotel');

const runSunsetJob = async () => {
  const startTime = new Date()
  console.log(`Running sunset job at ${startTime}`);
  try {
    const timelapsePath = await Timelapse.create(50000, 10000, true);

    const uploadStatus = await PostToTwitter(timelapsePath, startTime.toUTCString());
    
    if (uploadStatus) {
      console.log("Tweet success!");
    } else {
      console.log("Tweet failed :(");
    }
      
    console.log(`Sunset job finished at ${new Date()}`);
  } catch (e) {
    console.error('Something went wrong');
    console.log(e);
  }
};

runSunsetJob();
