const Messages = require('../model/messageModel');

module.exports.addMsg = async (req, res, next) => {
    try{
        const {from, to, message} = req.body;
        const newMsg = await Messages.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });

        if(newMsg){
            return res.json({message: 'Message sent successfully'});
        }
        return res.json({message: "Failed to add Message to the Database!", status: false});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.getAllMsgs = async (req, res, next) => {
    try{
        const {from, to} = req.body;
        const msgs = await Messages.find({
            users: {
                $all : [from,to],
            }
        })
        .sort({updatedAt: 1});
        const projectedMessages = msgs.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        })
        return res.json(projectedMessages);
    }
    catch(ex){
        next(ex);
    }
}
