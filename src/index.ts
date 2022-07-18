import { PostToTwitter } from "./postToTwitter";

const SunCalc = require('suncalc');
const NodeSchedule = require('node-schedule');
const Timelapse = require('./timelapse');
const Webhotel = require('./uploadToWebHotel');
// const fs = require('fs')

type Location = {
  lat: number,
  lon: number,
}

const loc : Location = {
  lat: 59.901331896946004,
  lon: 10.763861780217825,
};

const getNextSunset = () => {
  const now = new Date();
  let sunset = SunCalc.getTimes(now, loc.lat, loc.lon).sunsetStart;
  if (now >= sunset) {
    const tomorrow = now.setDate(now.getDate() + 1);
    sunset = SunCalc.getTimes(tomorrow, loc.lat, loc.lon).sunsetStart;
  }
  return sunset;
};

const runSunsetJob = async () => {
  const startTime = new Date()
  console.log(`Running sunset job at ${startTime}`);
  try {
    const timelapsePath = await Timelapse.create(5000000, 10000, false);

    const uploadStatus = await PostToTwitter(timelapsePath, startTime.toUTCString());
    
    if (uploadStatus) {
      console.log("Tweet success!");
    } else {
      console.log("Tweet failed :(");
    }

    console.log(`Sunset job finished at ${new Date()}`);
  } catch (e) {
    console.log('Something went wrong');
    console.log(e);
  }

  // And schedule next job for next sunset.
  const nextJob = getNextSunset();
  console.log(`Scheduling next job at ${nextJob}`);
  NodeSchedule.scheduleJob(nextJob, runSunsetJob);
};

const nextScheduledSunset = getNextSunset();
console.log(`Initializing first job, scheduled at ${nextScheduledSunset}`);
NodeSchedule.scheduleJob(nextScheduledSunset, runSunsetJob);

export {}