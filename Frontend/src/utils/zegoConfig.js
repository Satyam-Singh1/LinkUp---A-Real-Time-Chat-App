// src/utils/zegoConfig.js
export const ZEGOCLOUD_APP_ID = 1800661921; // ✅ Replace with your App ID
export const SERVER_SECRET = "2e3b7ab607eb8cebbcd4f7ad98865336"; // ✅ Optional, used for backend token generation
export const ROOM_ID = "my-room-id"; // ✅ You can make this dynamic based on your app
export const USER_ID = String(Math.floor(Math.random() * 100000)); // ✅ Can use logged-in user ID
export const USER_NAME = "User_" + USER_ID;
  