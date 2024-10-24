const firebaseApp = require('./firebase');

// Function to send a notification
const sendNotification = async (token, data) => {
  try {
    await firebaseApp.messaging().send({
      notification: {
        title: data.title,
        body: `Your case status is: ${data.caseStatus}`,
      },
      data: {
        caseStatus: data.caseStatus,
      },
      token,
      android: {
        priority: 'high',
      },
    });

    console.log(`Notification sent to token: ${token}`);
  } catch (error) {
    console.error(`Error sending notification to ${token}:`, error.message);

    // Handle specific error cases
    if (error.code === 'messaging/invalid-argument' || error.code === 'messaging/registration-token-not-registered') {
      console.warn(`Device token ${token} is not registered. Skipping notification.`);
      // Optionally, you may want to remove the token from your database here
    }
  }
};

module.exports = { sendNotification };
