import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
const PORT = 4000;

const app = express();

mongoose.connect('mongodb://localhost:27017/todo').then(() => {
    console.log('Connected to MongoDB');
});

const todoSchema = new mongoose.Schema({
    id:String,
    text:String,
    completed:Boolean
})
const Todo = mongoose.model('todo',todoSchema)
app.use(cors());
app.use(express.json());

app.get('/items',async (req,res)=>{
    const items = await Todo.find();
    res.json(items);
});

app.post('/items',async (req,res)=>{
    const newitem = new Todo({id:req.body.id,text:req.body.text,completed:req.body.completed});
    await newitem.save();
    res.json(newitem);
});

app.put('/items/:id',async (req,res)=>{
    console.log('Text received in update:', req.body.text); 
    const updatedItem= await Todo.findOneAndUpdate({id:req.params.id},
        {
        text:req.body.text,
        completed:req.body.completed},
        { new: true });
        console.log(`updated successfully ${updatedItem}`);
  res.json(updatedItem);
    
});

app.delete('/items/:id',async (req,res)=>{
    const deleteditem = await Todo.findOneAndDelete({id:req.params.id})
    res.json(deleteditem)
});
Todo.find().then((todos)=>{
    console.log(todos)
})


app.listen(PORT,()=>console.log(`port is running on ${PORT}`));