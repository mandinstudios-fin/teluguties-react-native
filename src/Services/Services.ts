import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.sendNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    
    try {
      const userDoc = await admin.firestore()
        .collection('profiles')
        .doc(notification.userId)
        .get();
        
      const fcmToken = userDoc.data()?.fcmToken;
      
      if (!fcmToken) return null;

      const message = {
        token: fcmToken,
        notification: {
          title: notification.title,
          body: notification.body
        }
      };

      await admin.messaging().send(message);
      await snap.ref.update({ sent: true });
      
    } catch (error) {
      console.error('Error:', error);
    }
  });