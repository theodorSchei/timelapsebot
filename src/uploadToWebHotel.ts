import { Client } from 'node-scp';
require('dotenv').config();

const Webhotel : any = {};

Webhotel.uploadFile = async (uploadFilePath : string, destinationPath : string) : Promise<boolean> => {
  try {
    const client = await Client({
      host: process.env.SCP_HOST,
      port: 22,
      username: process.env.SCP_USERNAME,
      password: process.env.SCP_PASSWORD,
      debug: console.log,
      // readyTimeout: 99999,
    });

    console.log('VI LASTER OPP!!!!!!!!!!!!!');

    await client.uploadFile(uploadFilePath, destinationPath);

    client.close(); // remember to close connection after you finish
    return true;
  } catch (e : any) {
    console.log(e);
    return false;
  }
};

module.exports = Webhotel;

export {}
