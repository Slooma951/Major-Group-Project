import connectToDatabase from '../../lib/mongoUtil';
import { ObjectId } from "mongodb";
import { getCustomSession } from '../../lib/session';

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
            const { title, description, date, time } = req.body;
            if (!title || !description || !date || !time) {
                return res.status(400).json({ success: false, message: "All fields are required." });
            }

            const newTask = {
                userId,
                title,
                description,
                date,
                time,
                completed: false, // Default to incomplete
                createdAt: new Date(),
            };

            const result = await todoCollection.insertOne(newTask);
            return res.status(201).json({ success: true, task: { _id: result.insertedId, ...newTask } });
        }

        if (req.method === "PUT") {
            const { taskId, title, description, date, time, completed } = req.body;

            if (!ObjectId.isValid(taskId)) {
                return res.status(400).json({ success: false, message: "Invalid task ID." });
            }

            const updateData = { title, description, date, time };
            if (completed !== undefined) {
                updateData.completed = completed;
            }

            const updateResult = await todoCollection.updateOne(
                { _id: new ObjectId(taskId), userId },
                { $set: updateData }
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
