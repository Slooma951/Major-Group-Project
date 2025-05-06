// sendEmailTasks.js
const brevo = require('@getbrevo/brevo');
const { MongoClient } = require('mongodb');

// === CONFIG ===
const MONGO_URI = 'mongodb+srv://root:R5lcPSJm1egBE0Z1@dvsnotedb.lozto.mongodb.net/DVSDB?retryWrites=true&w=majority&appName=DVSNoteDB';
const DB_NAME = 'DVSDB';
const COLLECTION = 'todo';
const brevoApiKey = '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';

async function sendDueEmails() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const todoCollection = db.collection(COLLECTION);
    const now = new Date();

    const tasks = await todoCollection.find({ notified: { $ne: true } }).toArray();
    const dueTasks = tasks.filter(task => {
      const dueTime = new Date(`${task.date}T${task.time}`);
      return dueTime <= now;
    });

    if (!dueTasks.length) {
      console.log('📭 No due tasks to notify.');
      return;
    }

    // ✅ Correct Brevo API setup for v2+
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      brevoApiKey
    );

    for (const task of dueTasks) {
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = '🔔 Task Due Reminder';
      sendSmtpEmail.htmlContent = `
        <html>
          <body>
            <h2>Dear ${task.userId},</h2>
            <p>This is a reminder that your task is now due.</p>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Due Date:</strong> ${task.date}</p>
            <p><strong>Time:</strong> ${task.time}</p>
            <br>
            <p>Best regards,<br>DVS Team</p>
          </body>
        </html>
      `;
      sendSmtpEmail.sender = { name: 'DVS', email: 'dannyaigbe4@gmail.com' };
      sendSmtpEmail.to = [{ email: task.userId }];
      sendSmtpEmail.replyTo = { email: 'dannyaigbe4@gmail.com', name: 'DVS Notifications' };

      try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        await todoCollection.updateOne({ _id: task._id }, { $set: { notified: true } });
        console.log(`✅ Email sent for task "${task.title}" to ${task.userId}`);
      } catch (err) {
        console.error(`❌ Email failed for "${task.title}":`);
        console.error(err.response?.body || err);
      }
    }
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
  } finally {
    await client.close();
  }
}

sendDueEmails();
