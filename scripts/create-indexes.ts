import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
const serviceAccount = require("../path-to-your-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

async function createIndexes() {
  try {
    // Create index for posts
    await db.collection('posts').listIndexes();
    await db.collection('posts').createIndex({
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    });

    // Create index for notifications
    await db.collection('notifications').createIndex({
      fields: [
        { fieldPath: 'toUserId', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    });

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

createIndexes(); 