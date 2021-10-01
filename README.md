# Timelapsebot

With this program running, every sunset is captured and made into a neat little timelapse. The program is intended to run on a Raspberry pi with a PiCamera module. 

![Gif of a sunset in oslo made with this program](https://github.com/theodorSchei/timelapsebot/blob/main/media/timelapse.gif?raw=true)

*(I need to clean my window!)*


## How it works
The program first calculates todays sunset time using location (lon, lat), and the date. This is a mathematical formula, wich allows for complete of-the-grid operation. (No API calls)

With the sunset time calculated, it adds it to the timelaps job-list. Once it is sunset, the program starts taking pictures, and when it is done starts resizing them to prepare for making the timelapse. Finally a timelapse is stiched together, and everything is stored neatly in a folder system. The last job is to queue tomorrows timelapse, before the job ends.

## Dependencies
- raspistill
- mogrify
- ffmpeg

## TODO
**Timing**
- [X] Get sunset time
- [X] Set timelapse to start at sunset

**Timelapse**
- [X] Make new folder
- [X] Start timelapse in new folder
- [X] Resize all photos
- [X] Stitch together a timelapse

**Sharing**
- [ ] Upload to youtube
- [ ] Delete photos
