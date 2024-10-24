const { v1: uuidV1 } = require('uuid');
const axios = require('axios');
const cron = require('node-cron');
const qs = require('qs');
const { user_device: UserDeviceModel, Sequelize: { Op } } = require('../models');
const Helper = require('../utils/helper');
const { sendNotification } = require('./notification-service');

const USCIS_TOKEN_URL = 'https://api-int.uscis.gov/oauth/accesstoken';
const USCIS_CASE_STATUS_URL = 'https://api-int.uscis.gov/case-status';

const registerToken = async (registrationToken) => {
  try {
    const publicId = uuidV1();

    await UserDeviceModel.create({ registration_token: registrationToken, public_id: publicId });

    return { doc: { publicId, message: 'Token successfully saved.' } };
  } catch (error) {
    return { err: error.message };
  }
};

const getAccessToken = async () => {
  try {
    const response = await axios.post(USCIS_TOKEN_URL, qs.stringify({
      client_id: 'su3SJI9H33OnIcA6TLecXctzxFo1YEPy',
      client_secret: 'vaIMHzzRHGRrK25c',
      grant_type: 'client_credentials',
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data.access_token;
  } catch (error) {
    return { err: error.message };
  }
};

const checkCaseStatus = async (receiptNumber, accessToken) => {
  try {
    const response = await axios.get(`${USCIS_CASE_STATUS_URL}/${receiptNumber}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response;
  } catch (error) {
    return { err: error.message };
  }
};

const submitReceipt = async (receiptNumber, registrationToken) => {
  try {
    const userDeviceDoc = Helper.convertCamelToSnake({ receiptNumber, registrationToken });

    const userDevice = await UserDeviceModel.findOne({ where: { registration_token: registrationToken } });

    if (userDevice) {
      await UserDeviceModel.update(userDeviceDoc, { where: { registration_token: registrationToken } });
    } else {
      const publicId = uuidV1();

      await UserDeviceModel.create({ ...userDeviceDoc, public_id: publicId });
    }

    const accessToken = await getAccessToken();

    if (accessToken.err) return { err: accessToken.err };

    const caseStatus = await checkCaseStatus(receiptNumber, accessToken);

    if (caseStatus.err) return { err: caseStatus.err };

    const { data: { case_status: { current_case_status_text_en: currentCaseStatusTextEn } } } = caseStatus;

    if (currentCaseStatusTextEn) {
      const notificationData = { title: 'Case Status Update', caseStatus: currentCaseStatusTextEn };

      const notificationResult = await sendNotification(registrationToken, notificationData);

      if (notificationResult.err) {
        return { err: notificationResult.err };
      }

      const updatedStatusHistory = userDevice.status_history || [];

      updatedStatusHistory.push({
        status: currentCaseStatusTextEn,
        timestamp: new Date().toISOString(),
      });

      await UserDeviceModel.update(
        { status: currentCaseStatusTextEn, status_history: updatedStatusHistory },
        { where: { registration_token: registrationToken } },
      );

      return { currentCaseStatusTextEn, message: 'Notification successfully sent.' };
    }

    return { message: 'Case status not found.' };
  } catch (error) {
    return { err: error.message };
  }
};

// Cron job to run every hour
cron.schedule('0 * * * *', async () => {
  try {
    const users = await UserDeviceModel.findAll({
      where: { status: { [Op.ne]: 'Case Approval Was Affirmed' } },
    });

    if (!users.length) {
      console.log('No users with pending case status.');

      return { message: 'No users with pending status' };
    }

    const accessToken = await getAccessToken();

    if (accessToken.err) return { err: accessToken.err };

    const messages = [];

    const checkStatusPromises = users.map(async (user) => {
      const receiptNumber = user.receipt_number;
      const registrationToken = user.registration_token;

      const caseStatus = await checkCaseStatus(receiptNumber, accessToken);

      if (caseStatus.err) return;

      const { data: { case_status: { current_case_status_text_en: currentCaseStatusTextEn } } } = caseStatus;

      if (currentCaseStatusTextEn && currentCaseStatusTextEn !== user.status) {
        messages.push({
          token: registrationToken,
          title: 'Case Status Update',
          caseStatus: currentCaseStatusTextEn,
        });

        const updatedStatusHistory = [
          ...user.status_history,
          { status: currentCaseStatusTextEn, timestamp: new Date().toISOString() },
        ];

        await UserDeviceModel.update(
          { status: currentCaseStatusTextEn, status_history: updatedStatusHistory },
          { where: { registration_token: registrationToken } },
        );
      }
    });

    await Promise.all(checkStatusPromises);

    if (messages.length > 0) {
      await Promise.all(messages.map(async (message) => {
        await sendNotification(message.token, {
          title: message.title,
          caseStatus: message.caseStatus,
        });
      }));
      console.log('Notifications sent for case status updates.');

      return { message: 'Notifications sent successfully.' };
    }

    console.log('No new case status updates.');

    return { message: 'No new updates for users.' };
  } catch (error) {
    console.error('Error running cron job:', error.message);

    return { err: error.message };
  }
});

module.exports = { registerToken, submitReceipt };
