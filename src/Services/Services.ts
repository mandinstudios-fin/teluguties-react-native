const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// Cloud function to send contact request notification to User B
exports.sendContactRequestNotification = functions.firestore
  .document('requests/{requestId}')
  .onCreate(async (snap, context) => {
    const requestData = snap.data();
    const fromUid = requestData.fromUid;
    const toUid = requestData.toUid;
    try {
      // Fetch User B's details from Firestore
      const userB = await admin.firestore().collection('users').doc(toUid).get();
      const userBData = userB.data();
      // Generate the deep link URL for User B to confirm the request
      const confirmLink = `https://yourapp.com/confirmContact/${fromUid}`;
      // Add the notification to User B's notifications subcollection
      await admin.firestore().collection('users').doc(toUid).collection('notifications').add({
        message: `User A wants to contact you. Click the link to confirm: ${confirmLink}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        link: confirmLink,
      });
      console.log('Contact request sent to User B');
    } catch (error) {
      console.error('Error sending contact request notification', error);
    }
  });