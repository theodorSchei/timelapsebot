const { format } = require('date-fns');
const execShPromise = require('exec-sh').promise;
const fs = require('fs');

const Timelapse: any = {};

Timelapse.create = async (totalDuration: number, timeBetweenShots: number, testing : boolean = false): Promise<string> => {
  const outputFileName = 'timelapse.mp4';
  
  let pathToTimelapseDirectory : string = '/home/pi/dev/timelapses';

  if (testing) {
    pathToTimelapseDirectory += '/testing';
  }

  let todaysDateFormatted: string = format(new Date(), 'yyyy-MM-dd');
  let pathToTodaysTimelapseDirectory: string = `${pathToTimelapseDirectory}/${todaysDateFormatted}`;

  try {
    console.log('Starting timelapse!');

    let out;

    // Check if todays directory is already made, if not make it
    if (!fs.existsSync(pathToTodaysTimelapseDirectory)) {
      fs.mkdir(pathToTodaysTimelapseDirectory, { recursive: false }, (err: any) => {
        if (err) throw err;
      });
      console.log(`Made directory at ${pathToTodaysTimelapseDirectory}`);
    } else {
      console.log(`Directory at ${pathToTodaysTimelapseDirectory} already exists!`);

      todaysDateFormatted = format(new Date(), 'yyyy-MM-dd-HH:mm');
      pathToTodaysTimelapseDirectory = `${pathToTimelapseDirectory}/${todaysDateFormatted}`;

      fs.mkdir(pathToTodaysTimelapseDirectory, { recursive: false }, (err: any) => {
        if (err) throw err;
      });
      console.log(`Made directory at ${pathToTodaysTimelapseDirectory}`);
    }

    // --- Taking photos ---

    console.log('Starting taking photos');
    // --vflip --hflip
    const raspistillCommand: string = `raspistill -ev 0 -t ${totalDuration} -tl ${timeBetweenShots} --preview '50,50,400,300' --awb sun -o ${pathToTodaysTimelapseDirectory}/image%04d.jpg`;

    try {
      out = await execShPromise(raspistillCommand, true);
    } catch (e : any) {
      console.log('Error: ', e);
      console.log('Stderr: ', e.stderr);
      console.log('Stdout: ', e.stdout);
      throw (e);
    }

    console.log('out: ', out.stdout, out.stderr);
    console.log('Finished taking photos');

    // --- Resizing photos ---

    console.log('Starting resizing photos');
    const mogrifyCommand: string = `mogrify -resize 3840x2160 ${pathToTodaysTimelapseDirectory}/*.jpg`;

    try {
      out = await execShPromise(mogrifyCommand, true);
    } catch (e : any) {
      console.log('Error: ', e);
      console.log('Stderr: ', e.stderr);
      console.log('Stdout: ', e.stdout);
      throw (e);
    }

    console.log('out: ', out.stdout, out.stderr);
    console.log('Finished resizing photos');


    // --- Stitching photos ---

    console.log('Starting stitching photos');
    // eslint-disable-next-line max-len
    // const ffmpegCommand = `ffmpeg -r 30 -pattern_type glob -i "${pathToTodaysTimelapseDirectory}/*.jpg" -c:v libx264 -pix_fmt yuv420p -movflags +faststart ${pathToTodaysTimelapseDirectory}/timelapse.mp4`;
    const ffmpegCommand: string = `ffmpeg -r 30 -pattern_type glob -i "${pathToTodaysTimelapseDirectory}/*.jpg" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${pathToTodaysTimelapseDirectory}/${outputFileName}`;

    try {
      out = await execShPromise(ffmpegCommand, true);
    } catch (e : any) {
      console.log('Error: ', e);
      console.log('Stderr: ', e.stderr);
      console.log('Stdout: ', e.stdout);
      throw (e);
    }

    console.log('out: ', out.stdout, out.stderr);
    console.log('Finished stitching photos');

    return `${pathToTodaysTimelapseDirectory}/${outputFileName}`;
  } catch (e : any) {
    console.log(e);
    throw (e)
  }
};

module.exports = Timelapse;

export {};
