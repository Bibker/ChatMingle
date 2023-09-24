const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400);
        throw new Error("UserId Param Not sent with request");
        return;
    }

    var isChat = await Chat.find(
        {
            isGroupChat: false,
            $and : [
                {users : {$elemMatch:{$eq:req.user._id}}},
                {users:{$elemMatch: {$eq:userId}}},
            ]
        }).populate("users","-password").populate("latestMessage");

        isChat = await User.populate(isChat, {
            path:'latestMessage.sender',
            select:'name pic email'
        });

        if(isChat.length>0)
        {
            res.send(isChat[0]);
        }
        else
        {
            var chatData= {
                chatName:"sender",
                isGroupChat:false,
                users:[req.user.id, userId]
            }
            try {
                const createdChat = await Chat.create(chatData);
                const fullChat= await Chat.findOne({_id: createdChat._id}).populate("users", "-password");
                res.status(200).send(fullChat);
                
            } catch (error) {
                res.status(400);
                throw new Error(error.message);
                
            }
        };
})

const fetchChat = asyncHandler(async( req, res) => {
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (results) => {
            results = await User.populate(results, {
                path:"latestMessage.sender",
                select:"name pic email"
            });
            res.status(200).send(results)
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const createGroupChat = asyncHandler( async(req,res)=> {
    if(!req.body.users || !req.body.name)
    {
        return res.status(400).send({message:"Please Fill all the Fields"});
    }

    var users = JSON.parse(req.body.users);
    if(users.length < 2) {
        return res.status(400).send({message:"Add more users"});
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin: req.user,       
        });

        const fullGroupChat= await Chat.findOne({_id:groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})

const renameGroupChat = asyncHandler(async(req,res)=> {
    const {chatId,chatName} = req.body;
    const updatedGroupChatName= await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new:true
        }
    ).populate("users", "-password")
    .populate("groupAdmin","-password");
    
    if(!updatedGroupChatName)
    {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else
    {
        res.json(updatedGroupChatName);
    }
})
module.exports= {accessChat,fetchChat, createGroupChat, renameGroupChat}