const userModel = require('../model/userModel');
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        // If username already exists
        const userNameCheck = await userModel.findOne({username});
        if(userNameCheck) {
            return res.json({message: "Username already exists.", status: false});
        }

        // If email already exists
        const emailCheck = await userModel.findOne({email});
        if(emailCheck) {
            return res.json({message: "Email already exists.", status: false});
        }

        // Proceed
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword
        })

        // Save the User
        await newUser.save();

        // Return the object made
        delete newUser.password;
        return res.status(201).json({newUser, status: true});
    }
    catch(err){
        next(err);
    }
};

module.exports.login = async (req, res, next) => {
    try{
        const {username, password} = req.body;

        const user = await userModel.findOne({username});
        if(!user){
            return res.json({message: "Username does not exist.", status: false})
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.json({message: "Incorrect Username or Password.", status: false});
        }

        delete user.password;

        return res.json({status: true, user});
    }
    catch(error){
        next(error);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await userModel.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    }
    catch(err){
        next(err);
    }
}

module.exports.getAllUser = async (req, res, next) =>{
    try{
        const users = await userModel.find({_id:{$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ])
        return res.json(users);
    }
    catch(err){
        next(err);
    }
}