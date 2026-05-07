const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { get } = require('http');

const app = express();
app.use(cors());
app.use(express.json());

function readData() {
    const raw = fs.readFileSync('db.json');
    return JSON.parse(raw);
}

function writeData(data) {
    fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
}

app.get('/todos', (req, res) => {
    const data = readData();
    const filter = (req.query.filter || '').toLowerCase().trim();
    let todos = data.todos;

    if (filter === 'completed') {
        todos = todos.filter(t => t.completed);
    } else if (filter === 'incomplete') {
        todos = todos.filter(t => !t.completed);
    } else if (filter === 'date-asc') {
        todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));    
    } else if (filter === 'date-desc') {
        todos.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));    
    }
    res.json(todos);
});

app.get('/todos/:id', (req, res) => {
    const data = readData();
    const id = Number(req.params.id);
    const todo = data.todos.find(t => t.id === id );
    if (!todo){
        return res.status(404).json({error: ' Todo not found'})
    }
    res.json(todo);
});

app.post('/todos', (req, res) => {
    const data = readData();
    const { title, description, priority ,dueDate } = req.body;
    if (!title || title.trim() ==='') {
        return res.status(400).json({ error: 'Title is required'});
    }
    if(dueDate && isNaN(Date.parse(dueDate))) {
        return res.status(400).json({ error: 'Invalid due date format' });
    }
    

    const nextId = Math.max(0, ...data.todos.map(t => t.id)) + 1;

    const newTodo = {
        id: nextId,
        title,
        description: description || '',
        dueDate: dueDate || null,
        priority: priority,
        completed: false
    };

    data.todos.push(newTodo);
    writeData(data);
    res.json(newTodo);
});


app.patch('/todos/:id', (req, res) => {
    const data = readData();
    const id = Number(req.params.id);

    const todo = data.todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    const { title, dueDate, description,priority, completed } = req.body;

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'Title cannot be empty' });
        }
        todo.title = title;
    }

    if (description !== undefined) {
        todo.description = description;
    }

    if (dueDate !== undefined) {
        if (dueDate && isNaN(Date.parse(dueDate))) {
            return res.status(400).json({ error: 'Invalid due date format' });
        }
        todo.dueDate = dueDate;
    }
    if (priority !== undefined){
        todo.priority = priority;
    }

    if (completed !== undefined) {
        todo.completed = completed;
    }


    writeData(data);
    res.json(todo);
});


app.delete('/todos/:id', (req, res) => {
    const data = readData();
    const id = Number(req.params.id);

    const index = data.todos.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    data.todos.splice(index, 1);
    writeData(data);

    res.json({ message: 'Todo deleted successfully' });
});

app.listen(3000, () => {
    console.log("Server działa: http://localhost:3000");
});