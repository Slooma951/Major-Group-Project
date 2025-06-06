import dotenv from 'dotenv';
dotenv.config();

const brevoApiKey = process.env.BREVO_API_KEY;


import { MongoClient } from 'mongodb';
import brevo from '@getbrevo/brevo';

const MONGO_URI = 'mongodb+srv://root:R5lcPSJm1egBE0Z1@dvsnotedb.lozto.mongodb.net/DVSDB?retryWrites=true&w=majority&appName=DVSNoteDB';
const DB_NAME = 'DVSDB';
const COLLECTION = 'todo';

export default async function handler(req, res) {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const todoCollection = db.collection(COLLECTION);

    const now = new Date();

    const tasks = await todoCollection.find({ notified: { $ne: true } }).toArray();
    const dueTasks = tasks.filter(task => new Date(`${task.date}T${task.time}`) <= now);

    if (!dueTasks.length) {
      return res.status(200).json({ message: ' No due tasks to notify.' });
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      brevoApiKey
    );

    for (const task of dueTasks) {
      const sendSmtpEmail = {
        subject: ' Task Due Reminder',
        htmlContent: `
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
        `,
        sender: { name: 'DVS', email: 'dannyaigbe4@gmail.com' },
        to: [{ email: task.userId }],
        replyTo: { email: 'dannyaigbe4@gmail.com', name: 'DVS Notifications' },
      };

      try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        await todoCollection.updateOne({ _id: task._id }, { $set: { notified: true } });
        console.log(` Email sent for task "${task.title}" to ${task.userId}`);
      } catch (err) {
        console.error(` Email failed for "${task.title}": ${err.message}`);
      }
    }

    return res.status(200).json({ message: `${dueTasks.length} email(s) sent successfully.` });

  } catch (err) {
    console.error('Database error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
