const mongoose = require('mongoose'); 
const Store  = require('./store'); 
const router = require('express').Router(); 

//for adding a new scedule in the store: 
router.post('/sleep',async(req,res)=>{ 
    try{

        const { userId, hours, timestamp } = req.body;
    // Check if userId, hours, and timestamp are provided
    if (!userId || !hours || !timestamp) {
        return res.status(400).json({ message: 'userId, hours, and timestamp are required fields' });
    }

    // Check if hours is a valid number
    if (isNaN(hours) || hours <= 0 || hours>24) {
        return res.status(400).json({ message: 'hours must be a valid positive number and in the range 1-24' });
    }

    // Check if timestamp is a valid date
    if (isNaN(Date.parse(timestamp))) {
        return res.status(400).json({ message: 'timestamp must be a valid date' });
    }

    //check if the record already exists

    const existUser = await Store.findOne({
        userId: userId,
       timestamp: timestamp,
       hours: hours
    })
  
    
    if(existUser){
        return res.status(400).json({message: "Record already exists"});
    }

       const newStore = new Store({
        userId : req.body.userId,
        hours : req.body.hours,
        timestamp : req.body.timestamp
       })
       const savedStore = await newStore.save(); 
       res.status(201).json(savedStore); 
    }
    catch(err){
        res.status(500).json(err.message); 
    }
})

//for getting the list of all sleep records of a user: 
router.get('/sleep/:userId',async(req,res)=>{
    try{
        const userId = req.params.userId ;
          const userDetails = await Store.find({userId}).sort({timestamp:1}); 
          if (userDetails.length===0) {
            return res.status(404).json({ message: 'No records found for the specified userId' });
        }
          res.status(200).json(userDetails); 
    }
    catch(err){
        res.status(500).json(err.message); 
    }
})

//for deleting the specific sleep with its id: 
router.delete('/sleep/:recordId',async(req,res)=>{

    try {
        const result = await Store.findByIdAndDelete(req.params.recordId);
        if (!result) {
            return res.status(404).json({ message: 'No record found, Cannot be deleted' });
        }

        res.status(200).json({ message: 'Record has been deleted' });
    } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

module.exports = router ; 