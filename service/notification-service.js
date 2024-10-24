const firebaseApp = require('./firebase');

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

    return { message: 'Notification sent.' };
  } catch (error) {
    console.error(`Error sending notification to ${token}:`, error.message);

    if (error.code === 'messaging/invalid-argument' || error.code === 'messaging/registration-token-not-registered') {
      console.warn(`Device token ${token} is not registered. Skipping notification.`);
    }

    return { err: error.message };
  }
};

module.exports = { sendNotification };
