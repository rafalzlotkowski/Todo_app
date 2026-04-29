const express = require ('express');
const cors = require ('cors');
const fs =require ('fs');
const app = express();
app.use(cors());
app.use(express.json());


function readData(data){
    const data = fs.readFileSync('db.json');
    return JSON.parse(data);
}

function readData(data){
    fs.writeFileSync('db.json',
        JSON.stringify(data, null, 2)
    );
}
app.get('/todos',(req , res) => {
    const data = readData();
    res.json(data, todos);
})

app.post('/todos',(req , res) =>{
    const data = readData();
    const{title, description, dueDate} = req.body;
    const nextId = data.todos.length > 0 ? data.todos[data.todos.length - 1].id + 1 : 1;
    const newTodo = {
        id: nextId,
        title,
        description,
        dueDate,
        completed: false
    };
    data.todos.push(newTodo);
    writeData(Data);
    res.json( newTodo);
})
app.put('/todos',(req , res) =>{

    const data = readData();
    const id = Number(req.params.id);

    const todo = data.todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({error:'Todo not found'});
    }
    Object.assign(todo, req.body);
    writeData(data);
    res.json(todo);
    
    
});
app.delete('/todos/id',(req, res)=>{
    const data = readData();
    const id = Number(req.params.id);
    const index = data.todos.findIndex(t => t.id === id);
    if (index === -1){
        return res.status(404).json({error:'todo not found'})
    }
    writeData(data);
    res.json({message:'todo deleted successfully'});
})

app.listen(3000, () => {
  console.log("JSON Server is running");
});