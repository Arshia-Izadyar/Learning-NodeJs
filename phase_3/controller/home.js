const mongoose = require('mongoose');
const express = require('express');

const Task = require('../db/models/task');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');


// async function allItems(req, res) {

//     let task = await Task.find({});
//     res.status(200);
//     return res.json({"data":task,"status":"Ok"});

// }

const allItems = asyncWrapper(async (req, res) => {

    let task = await Task.find({});
    res.status(200);
    throw createCustomError("error happened", 510);
    return res.json({"data":task,"status":"Ok"});

})


async function createTask(req, res){
    try{

        let task = await Task.create({name:req.body.name, completed:Boolean(req.body.status)});
        res.status(201);
        return res.json({'status':"saved data",'data':task});
    } catch(err){
        res.status(500);
        return res.json({'status':"failed to save data", 'data':null});
    }

}

async function getTask(req, res){
    let id = req.params.id;
    try{
        let task = await Task.findOne({_id: id});
        res.status(200);
        return res.json({'status':"Ok",'data':task});
    } catch(err) {
        res.status(404);
        return res.json({'status':"failed to find data", 'data':null})
    }
}

async function updateTask(req, res){
    let id = req.params.id;
    let {name, completed} = req.body;
    try{
        let task = await Task.findOneAndUpdate({ _id: id }, req.body, {
            new:true, runValidators: true
        });
        console.log(task)


        if (!task){
            res.status(404);
            return res.json({'status':"failed to find data", 'data':null});
        }
        res.status(202);
        res.json({"status":"Ok", "data":task});
    } catch(err){
        res.status(500);
        return res.json({'status':"error happened", 'data':err})
    }
}

async function deleteTask(req, res){
    let id = req.params.id;
    try{
        let task = await Task.findOneAndDelete({_id: id});
        if (!task){
            res.status(404);
            return res.json({'status':"failed to find data", 'data':null});
        }
        res.status(204);
        return res.json({'status':"data deleted", 'data':null});
    }catch(err){
        res.status(500);
        return res.json({'status':"error happened", 'data':null})
    }
}

module.exports = {allItems, createTask ,getTask, updateTask, deleteTask};


