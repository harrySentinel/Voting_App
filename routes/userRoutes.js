const express = require('express');
const router = express.Router();
const User =  require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt')

// POST route to add a person
router.post('/signup', async(req, res) =>{

    try{
       const data = req.body // assume kar rhe request body user data ko contain kr rhi

       // create a new user document using the Mongoose model
       const newUser = new User(data);

       // save the new user to the database
       const response = await newUser.save();
       console.log('data saved of user');

       const payload = {
           id: response.id
       }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

       res.status(200).json({response: response, token: token});
    }
    catch(err){
       console.log(err);
       res.status(500).json({error: 'Internal Server Error'});
    }
  
})

// Login Routes
router.post('/login', async(req, res) => {
    try{
        // extract the aadharCardNumber and password from request body
        const {aadharCardNumber, password} =  req.body;

        // find the user by aadharCardNumber
        const user = await Person.findOne({aadharCardNumber: aadharCardNumber});

        // if user does not exist or password does not match, return error
        if( !user || ! (await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token
        const payload = {
            id : user.id,
        }
        const token = generateToken(payload);

        // return token as reponse 
        res.json({token});
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Profile route
router.get('/profile',jwtAuthMiddleware, async (req, res) => {
    
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({user});

    }catch(error){
        console.log(error);
        res.status(500).json({error : 'Internal Server Error'});
    }
})


router.put('/profile/password', async (req, res) => {
    try{
      const UserId = req.user.id; // extracting the id from the URL parameter
      const updatedPersonData = req.body; // updated data for the person

      const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
          new: true, // Return the updated document
          runValidators: true, // Run Mongoose validation
      })

      if(!response){
        return res.status(404).json({error: 'Person not found'});
      }

      console.log('data updated');
      res.status(200).json(response);

    } catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
})



module.exports = router;