/*
const SunCalc = require('suncalc');
const schedule = require('node-schedule');
const fs = require('fs');
const timelapse = require('./timelapse');

const todaysDate = new Date();
const myLatitude = ;
const myLongitude = ;

const sunsetTime = SunCalc.getTimes(todaysDate, myLatitude, myLongitude);

if (fs.existsSync(timelapse.pathToTodaysTimelapseDirectory)) {
  console.log('Timelapse is already made today!');
} else {
  console.log('Planning timelapse for today');
  var job = schedule.scheduleJob(sunsetTime.sunsetStart, function() {
    timelapse.create();
  });
}

*/

const SunCalc = require('suncalc');
const NodeSchedule = require('node-schedule');
const timelapse = require('./timelapse');
// const fs = require('fs')

const loc = {
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

const runSunsetJob = () => {
  console.log(`Running sunset job at ${new Date()}`);
  timelapse.create();
  console.log(
    new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ''),
  );
  // ...
  console.log(`Sunset job finished at ${new Date()}`);

  // And schedule next job for next sunset.
  const nextJob = getNextSunset();
  console.log(`Scheduling next job at ${nextJob}`);
  NodeSchedule.scheduleJob(nextJob, runSunsetJob);
};

const nextScheduledSunset = getNextSunset();
console.log(`Initializing first job, scheduled at ${nextScheduledSunset}`);
NodeSchedule.scheduleJob(nextScheduledSunset, runSunsetJob);
