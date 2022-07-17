const Timelapse = require('./timelapse');
const Webhotel = require('./uploadToWebHotel');

const runSunsetJob = async () => {
  console.log(`Running sunset job at ${new Date()}`);
  try {
    const timelapsePath = await Timelapse.create(50000, 10000, true);

    const uploadStatus = await Webhotel.uploadFile(timelapsePath, 'video/folder/dagens.mp4');

    if (uploadStatus) {
      console.log('UPLOAD SUCCESSFUL!!!!!!!!!');
    } else {
      console.log('UPLOAD FAILED');
    }
    console.log(`Sunset job finished at ${new Date()}`);
  } catch (e) {
    console.error('Something went wrong');
    console.log(e);
  }
};

runSunsetJob();
