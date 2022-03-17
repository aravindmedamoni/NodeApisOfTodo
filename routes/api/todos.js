const express = require('express');
const router = express.Router();
const passport = require('passport');


//Todo Schema
const Todo = require('../../models/todo');

//For testing purpose
router.get('/test',(req, res)=>{
    res.json("Welcome To api/todos route");
})


//@Type     POST
//@route    /api/todos/save
//@desc     route for saving todo
//@access   PUBLIC

router.post('/save',(req,res)=>{
   const todo = new Todo({
       title:req.body.title,
       text:req.body.text,
       status:req.body.status
   })

   todo.save()
   .then(todo=>{
       res.json({
           message:"successfully saved data",
           success:true,
           data:todo
       })
   }).catch(err=>{
       console.log(`Error while saving todo : ${err}`);
   })
});

//@Type     GET
//@route    /api/todos/alltodos
//@desc     route for getting all todos
//@access   PUBLIC
router.get('/all',(req,res)=>{
    Todo.find().then(todos=>{
       if(todos.length===0){
           res.json({
               message:"We don't have any todo's..!",
               success:false,
               data:todos
           })
       }else{
        res.json({
            message:"We have your todo's..!",
               success:true,
               data:todos 
        })
       }
    }).catch(err=>{
        console.log(`Error while fetching todos is: ${err}`);
    })
});

//@Type     GET
//@route    /api/todos/:id
//@desc     route for getting todo by its id
//@access   PUBLIC
router.get('/:id',(req, res)=>{
    Todo.findById(req.params.id).then(todo=>{
        if(todo){
            res.json({
                message:"Data fetched successfully",
                success:true,
                data:todo
            })
        }else{
            res.json({
                message:"We don't have the record",
                success:false,
                data:null
            })
        }
    }).catch(err=>{
        console.log(`Error getting todo is: ${err}`);
    })
})


//@Type     PUT
//@route    /api/todos/update/:id
//@desc     route for updating todo by it's id 
//@access   PUBLIC
router.put('/update/:id',(req, res)=>{
    Todo.findById(req.params.id).then(todo=>{
        if(todo){
            let updatedTodo = {};
        //console.log(req.body.title);
        updatedTodo.title = !!req.body.title?req.body.title:todo.title;
        // console.log(`Updated title : ${updatedTodo.title}`);
        // console.log(`existed title : ${todo.title}`);
        updatedTodo.text = !!req.body.text ?req.body.text : todo.text;
        updatedTodo.status = !!req.body.status ? req.body.status : todo.status;
        Todo.findByIdAndUpdate(req.params.id,{$set:updatedTodo},{new:true}).then(todo=>{
            res.json({
                message:"Successfully updated..",
                success:true,
                data:todo
            })}).catch(err=>{
                console.log(`Error while updating todo is : ${err}`);
            })
        }else{
            res.json({
                message:"we don't have record to update..!",
                success:false,
                data:null
            })
        }
        
    }).catch(err=>console.log(`Error finding element to update is: ${err}`));
    
})

//@Type     DELETE
//@route    /api/todos/delete/:id
//@desc     route for deleting todo by it's id 
//@access   PUBLIC
router.delete('/delete/:id', (req, res)=>{
    Todo.findByIdAndDelete(req.params.id).then(successRes=>{
        if(!successRes){
            res.json({
                message:"We don't have record to delete..!",
                success:false,
                data:null
            })
        }else{
            res.json({
                message:"Successfully deleted todo",
                success:true,
                data:successRes
            })
        }
    }).catch(err=>{
        console.log(`Error deleting todo is: ${err}`);
    })
})

//@Type     DELETE
//@route    /api/todos/deleteall
//@desc     route for deleting all todos 
//@access   PUBLIC
router.delete('/deleteall', (req, res)=>{
    Todo.deleteMany().then((resp)=>{
        if(resp){
            res.json({
                message:"We don't have records to wipe up..!",
                success:false,
                data:null,
            })
        }else{
            res.json(
                {
                    message:"successfully deleted all todos",
                    success:true,
                    data:null
                }
                )
        }
    }).catch(err=>{
        console.log(`Error deleting todo is: ${err}`);
    })
});



module.exports = router;