import connectToDatabase from '../../../lib/mongoUtil';
import brevo from '@getbrevo/brevo';
import cron from 'node-cron';

let cronJobInitialized = false;

export default async function handler(req, res) {
  if (!cronJobInitialized) {
    cronJobInitialized = true;

    cron.schedule('* * * * *', async () => {
      try {
        const db = await connectToDatabase();
        const todoCollection = db.collection("todo");

        const now = new Date();
        const tasks = await todoCollection.find({
          notified: { $ne: true }
        }).toArray();

        const dueTasks = tasks.filter(task => {
          const dueDateTime = new Date(`${task.date}T${task.time}`);
          return dueDateTime <= now;
        });

        if (!dueTasks.length) {
          console.log(`[Cron] No due tasks at ${now.toISOString()}`);
          return;
        }

        // ✅ Brevo API Setup
        const apiInstance = new brevo.TransactionalEmailsApi();
        const apiKey = apiInstance.authentications['api-key'];
        apiKey.apiKey = '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';

        for (const task of dueTasks) {
          const sendSmtpEmail = new brevo.SendSmtpEmail();

          sendSmtpEmail.subject = "🔔 Task Due Reminder";
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

          // ✅ Updated Verified Sender Address
          sendSmtpEmail.sender = { name: "DVS", email: "dannyaigbe4@gmail.com" };
          sendSmtpEmail.to = [{ email: task.userId, name: task.userId.split('@')[0] }];
          sendSmtpEmail.replyTo = { email: "dannyaigbe4@gmail.com", name: "DVS Notifications" };
          sendSmtpEmail.headers = { "X-Mail-Tag": `due-task-${task._id}` };
          sendSmtpEmail.params = { parameter: task.title, subject: "Task Due Notification" };

          try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
            await todoCollection.updateOne(
              { _id: task._id },
              { $set: { notified: true } }
            );
            console.log(`[Cron] Email sent for task "${task.title}" to ${task.userId}`);
          } catch (err) {
            console.error(`[Cron] Failed sending email for task "${task.title}":`, err.message);
          }
        }
      } catch (err) {
        console.error(`[Cron] General error:`, err.message);
      }
    });

    console.log(`[Cron] Email scheduler initialized (every minute).`);
  }

  return res.status(200).json({ message: 'Email cron job initialized and running.' });
}
