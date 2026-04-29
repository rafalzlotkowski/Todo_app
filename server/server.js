const express = require ('express');
const cors = require ('cors');
const fs =require ('fs');
const app = express();
app.use(cors());
app.use(express.json());

let nextId = 1;

function writeData(data){
    fs.writeFileSync('db.json',
        JSON.stringify
    )
}
app.get('/todos',(req , res) => {
    res.json(todos)
})

app.post('/todos',(req , res) =>{
    const{title, description, dueDate} = req.body;
    const newTodo = {
        id: nextId++,
        title,
        description,
        dueDate,
        completed: false
    };
    todos.push(newTodo);
    res.json( newTodo);
})

server.listen(3000, () => {
  console.log("JSON Server is running");
});