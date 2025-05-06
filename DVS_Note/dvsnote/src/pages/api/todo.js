import connectToDatabase from '../../lib/mongoUtil';
import { ObjectId } from "mongodb";
import { getCustomSession } from '../../lib/session';
const brevo = require('@getbrevo/brevo');


export default async function handler(req, res) {
    try {
        const session = await getCustomSession(req, res);
        if (!session.user) {
            return res.status(401).json({ success: false, message: 'Session invalid or expired' });
        }

        const db = await connectToDatabase();
        const todoCollection = db.collection("todo");
        const userId = session.user.email;

        if (req.method === "GET") {
            const tasks = await todoCollection.find({ userId }).toArray();
            return res.status(200).json({ success: true, tasks });
        }

        if (req.method === "POST") {
            const { title, date, time, status = "Pending", importance = "Low" } = req.body;
            if (!title || !date || !time) {
                return res.status(400).json({ success: false, message: "Title, date, and time are required." });
            }

            const newTask = {
                userId,
                title,
                date,
                time,
                status,
                importance,
                createdAt: new Date(),
                notified: false, // needed for future tracking
            };

            const result = await todoCollection.insertOne(newTask);

            //  Send Email Immediately (from sendEmailTasks.js)
            try {
                const apiInstance = new brevo.TransactionalEmailsApi();
                apiInstance.setApiKey(
                    brevo.TransactionalEmailsApiApiKeys.apiKey,
                    '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'
                );

                const sendSmtpEmail = new brevo.SendSmtpEmail();
                sendSmtpEmail.subject = ' Your Task is due in DVSNOTE';
                sendSmtpEmail.htmlContent = `
                    <html>
                      <body>
                        <h2>Hello ${userId},</h2>
                        <p>Your task is now due:</p>
                        <p><strong>Title:</strong> ${title}</p>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Status:</strong> ${status}</p>
                        <p><strong>Importance:</strong> ${importance}</p>
                        <br>
                        <p></p>
                        <p>Best regards,<br>DVS Team</p>
                      </body>
                    </html>
                `;
                sendSmtpEmail.sender = { name: 'DVS', email: 'dannyaigbe4@gmail.com' };
                sendSmtpEmail.to = [{ email: userId }];
                sendSmtpEmail.replyTo = { email: 'dannyaigbe4@gmail.com', name: 'DVS Notifications' };

                await apiInstance.sendTransacEmail(sendSmtpEmail);
                console.log(` Email sent for task "${title}" to ${userId}`);
            } catch (emailErr) {
                console.error(` Failed to send email for "${title}":`);
                console.error(emailErr.response?.body || emailErr);
            }

            return res.status(201).json({ success: true, task: { _id: result.insertedId, ...newTask } });
        }

        if (req.method === "PUT") {
            const { taskId, title, date, time, status = "Pending", importance = "Low" } = req.body;

            if (!ObjectId.isValid(taskId)) {
                return res.status(400).json({ success: false, message: "Invalid task ID." });
            }

            const updateResult = await todoCollection.updateOne(
                { _id: new ObjectId(taskId), userId },
                { $set: { title, date, time, status, importance } }
            );

            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Task not found." });
            }

            return res.status(200).json({ success: true, message: "Task updated successfully." });
        }

        if (req.method === "DELETE") {
            const { taskId } = req.body;

            if (!ObjectId.isValid(taskId)) {
                return res.status(400).json({ success: false, message: "Invalid task ID." });
            }

            const result = await todoCollection.deleteOne({ _id: new ObjectId(taskId), userId });
            if (result.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "Task not found." });
            }

            return res.status(200).json({ success: true, message: "Task deleted successfully." });
        }

        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
    } catch (error) {
        console.error("Error handling task:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}
