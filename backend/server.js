require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Error:', err));

const habitSchema = new mongoose.Schema({
    name: String,
    description: { type: String, default: '' },
    done: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Habit = mongoose.model('Habit', habitSchema);

app.get('/api/habits', async (req, res) => {
    const habits = await Habit.find();
    res.json(habits);
});

app.post('/api/habits', async (req, res) => {
    const { name, description } = req.body;
    const newHabit = new Habit({ name, description: description || '', done: false });
    await newHabit.save();
    res.json(newHabit);
});

app.put('/api/habits/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Not found' });
        if (req.body.done !== undefined) habit.done = req.body.done;
        if (req.body.name) habit.name = req.body.name;
        if (req.body.description !== undefined) habit.description = req.body.description;
        await habit.save();
        res.json(habit);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.delete('/api/habits/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});