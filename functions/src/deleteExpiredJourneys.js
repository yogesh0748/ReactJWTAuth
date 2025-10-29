const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cron = require('node-cron');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Run every hour
exports.deleteExpiredJourneys = functions.pubsub
  .schedule('0 * * * *')
  .timeZone('Asia/Kolkata') // Set to your timezone
  .onRun(async (context) => {
    try {
      const now = new Date();
      const snapshot = await db.collection('journeys').get();
      
      const batch = db.batch();
      let deleteCount = 0;

      for (const doc of snapshot.docs) {
        const journey = doc.data();
        const journeyDateTime = new Date(`${journey.date}T${journey.time}`);

        // If journey time has passed
        if (journeyDateTime < now) {
          console.log(`Deleting expired journey: ${doc.id}`);
          
          // Add journey to completed_journeys collection for record keeping
          const archiveRef = db.collection('completed_journeys').doc(doc.id);
          batch.set(archiveRef, {
            ...journey,
            deletedAt: admin.firestore.FieldValue.serverTimestamp(),
            originalId: doc.id
          });

          // Delete the original journey
          const journeyRef = db.collection('journeys').doc(doc.id);
          batch.delete(journeyRef);
          
          deleteCount++;
        }
      }

      if (deleteCount > 0) {
        await batch.commit();
        console.log(`Successfully deleted ${deleteCount} expired journeys`);
      } else {
        console.log('No expired journeys found');
      }

      return null;
    } catch (error) {
      console.error('Error deleting expired journeys:', error);
      throw error;
    }
  });