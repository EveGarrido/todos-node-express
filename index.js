const express = require('express');
const path = require('path');
const fs = require('fs/promises');

app = express();

app.use(express.json());

const jsonTasksPath = path.resolve('./file/tasks.json');

app.get('/tasks', async(req, res)=>{
  const jsonFile = await fs.readFile(jsonTasksPath, 'utf8');
  res.send(jsonFile);
});

app.post('/tasks', async(req, res)=>{
  const task = req.body;
  const arrayJsonTasks = JSON.parse(await fs.readFile(jsonTasksPath, 'utf8'));
  const lastIndex = arrayJsonTasks.length - 1;
  const newId = arrayJsonTasks[lastIndex].id + 1;
  arrayJsonTasks.push({id:newId, ...task});
  await fs.writeFile(jsonTasksPath, JSON.stringify(arrayJsonTasks));
  res.end();
});

app.put('/tasks', async(req, res)=>{
  const arrayJsonTasks = JSON.parse(await fs.readFile(jsonTasksPath, 'utf8'));
  const {id, title, description, status} = req.body;
  const taskIndex = arrayJsonTasks.findIndex(task => task.id === id);
  if(taskIndex >=0){
    arrayJsonTasks[taskIndex].status = status;
  }
  await fs.writeFile(jsonTasksPath, JSON.stringify(arrayJsonTasks));
  res.end();
});

app.delete('/tasks', async(req, res)=>{
  const arrayJsonTasks = JSON.parse(await fs.readFile(jsonTasksPath, 'utf8'));
  const {id} = req.body;
  const taskIndexToDelete = arrayJsonTasks.findIndex(task => task.id === id);
  arrayJsonTasks.splice(taskIndexToDelete, 1);
  await fs.writeFile(jsonTasksPath, JSON.stringify(arrayJsonTasks));
  res.end();
})


const PORT = 8000;
app.listen(PORT);
console.log(`Servidor escuchando en ${PORT}`); 