const { format } = require('date-fns');
var execShPromise = require('exec-sh').promise;
const fs = require('fs');

var pathToTimelapseDirectory = '/home/pi/dev/timelapses';
var todaysDateFormatted = format(new Date(), 'yyyy-MM-dd');
var pathToTodaysTimelapseDirectory =
  pathToTimelapseDirectory + '/' + todaysDateFormatted;

const raspistillCommand =
  "raspistill -ev 0 --vflip --hflip -t 60000 -tl 10000 --preview '50,50,400,300' --awb sun -o " +
  pathToTodaysTimelapseDirectory +
  '/image%04d.jpg';
const mogrifyCommand =
  'mogrify -resize 1920x1080  ' + pathToTodaysTimelapseDirectory + '/*.jpg';
const ffmpegCommand =
  'ffmpeg -r 30 -pattern_type glob -i "' +
  pathToTodaysTimelapseDirectory +
  '/*.jpg" -c:v libx264 -pix_fmt yuv420p -movflags +faststart ' +
  pathToTodaysTimelapseDirectory +
  '/timelapse.mp4';

const timelapse = {};

// run interactive bash shell
timelapse.create = async () => {
  console.log('Starting timelapse!');

  let out;

  // Check if todays directory is already made, if not make it
  if (!fs.existsSync(pathToTodaysTimelapseDirectory)) {
    fs.mkdir(pathToTodaysTimelapseDirectory, { recursive: false }, err => {
      if (err) throw err;
    });
    console.log('Made directory at ' + pathToTodaysTimelapseDirectory);
  } else {
    console.log(
      'Directory at ' + pathToTodaysTimelapseDirectory + ' already exists!'
    );
  }

  //--- Taking photos ---

  console.log('Starting taking photos');

  try {
    out = await execShPromise(raspistillCommand, true);
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', e.stderr);
    console.log('Stdout: ', e.stdout);

    return e;
  }

  console.log('out: ', out.stdout, out.stderr);
  console.log('Finished taking photos');

  //--- Resizing photos ---

  console.log('Starting resizing photos');

  try {
    out = await execShPromise(mogrifyCommand, true);
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', e.stderr);
    console.log('Stdout: ', e.stdout);

    return e;
  }

  console.log('out: ', out.stdout, out.stderr);
  console.log('Finished resizing photos');

  //--- Stitching photos ---

  console.log('Starting stitching photos');

  try {
    out = await execShPromise(ffmpegCommand, true);
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', e.stderr);
    console.log('Stdout: ', e.stdout);

    return e;
  }

  console.log('out: ', out.stdout, out.stderr);
  console.log('Finished stitching photos');
};

module.exports = timelapse;
