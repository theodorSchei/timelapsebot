import { TwitterApi } from 'twitter-api-v2';
import 'dotenv/config'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

export const PostToTwitter = async (videoPath: string, tweetText: string): Promise<boolean> => {
  console.log('Posting to twitter');
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET_KEY!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });

    console.log('Client created');

    console.log('Uploading video');
    const mediaIds = await Promise.all([
      // file path
      client.v1.uploadMedia(videoPath, { type: 'longmp4' }),
    ]);

    console.log('Video uploaded');

    console.log('Posting tweet');
    return await client.v1.tweet(tweetText, { media_ids: mediaIds }).then(
      (res) => {
        console.log(res);
        console.log(`Successfully posted tweet!!!!`);
        return true;
      },
      (err) => {
        console.log(err);
        return false;
      }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};
