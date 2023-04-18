const {io} =require('./server');



let users=[];

const alreadyJoinedUser=(userId)=>{
    let isJoined=false;

    users.forEach((item)=>{
        if(item.userId===userId){
            isJoined=true;
        }
    });

    return isJoined;
}

const findUsersSocketId=(userId)=>{
    const user=users.find((item)=>item.userId===userId);
    return user ? user.socketId :undefined;
}

const removeUserWhenDisconnects=(socketId)=>{
    console.log(`user socket id is ${socketId}`);
   let newUsers=users.filter((item)=>item.socketId !==socketId);
   users=newUsers;
}



module.exports.ioHandler=()=>{
    io.sockets.on('connection',(socket)=>{

     
        console.log(`user joined ${socket.id}`);

        socket.on("hello",(args)=>{
            console.log(args);
        })


        socket.on("sendMessage",(senderId,recieverId,message)=>{
           const socketIdOfReciever=findUsersSocketId(recieverId);
           const socketIdOfSender=findUsersSocketId(senderId);
           socketIdOfReciever &&  io.to(socketIdOfReciever).emit("getMessage",{senderId,message});
           socketIdOfReciever &&  io.to(socketIdOfReciever).emit("getNotification",{isMessageNotification:true});
           io.to(socketIdOfSender).emit("getMessage",{senderId,message});
        })


        socket.on("addImageMessage",(senderId,recieverId,isImageMessage,image)=>{
            const socketIdOfReciever=findUsersSocketId(recieverId);
            const socketIdOfSender=findUsersSocketId(senderId);

    
            socketIdOfReciever &&  io.to(socketIdOfReciever).emit("getImageMessage",{senderId,isImageMessage,image});
            socketIdOfReciever &&  io.to(socketIdOfReciever).emit("getNotification",{isMessageNotification:true});
            socketIdOfSender&& io.to(socketIdOfSender).emit("getImageMessage",{senderId,isImageMessage,image});

         })

         socket.on("CallUser",(senderId, recieverId, offerDescription,senderAvatar,senderUserName)=>{
            const socketIdOfReciever=findUsersSocketId(recieverId);
  
            socketIdOfReciever &&  io.to(socketIdOfReciever).emit("getOffer",{senderId,offerDescription,senderAvatar,senderUserName});
         });

         
         socket.on("sendOfferAnswer",(senderId, recieverId, answerDescription)=>{
            const socketIdOfReciever=findUsersSocketId(recieverId);
            socketIdOfReciever &&  io.to(socketIdOfReciever).emit("getOfferAnswer",{senderId,answerDescription});
         });

         socket.on("getIceCandidate",(user1Id, user2Id, iceCandidate)=>{
            const socketIdOfUser1Id=findUsersSocketId(user1Id);
            const socketIdOfUser2Id=findUsersSocketId(user2Id);
            socketIdOfUser1Id &&  io.to(socketIdOfUser1Id).emit("sendBackIceCandidate",{iceCandidate});
            socketIdOfUser2Id &&  io.to(socketIdOfUser2Id).emit("sendBackIceCandidate",{iceCandidate});
         });

         
         socket.on("callDecline",(senderId)=>{

        
            const socketIdOfUser1Id=findUsersSocketId(senderId);
           
            socketIdOfUser1Id &&  io.to(socketIdOfUser1Id).emit("sendCallDecline",{message:"call declined by the other user"});
            
         });



         socket.on("callHangUp",(userId,message)=>{
            const socketIdOfReciever=findUsersSocketId(userId);
            socketIdOfReciever &&  io.to(socketIdOfReciever).emit("handleCallHangUp",{message});
         });

         socket.on("notification",(userId)=>{
            console.log(`notification console ah rha hun ${userId}`);
            const socketIdOfReciever=findUsersSocketId(userId);
            socketIdOfReciever &&  io.to(socketIdOfReciever).emit("getNotification",{message:'you got notification'});
         });
        
        socket.on('addUser',(userId)=>{
            
            if(userId===null){
                return;
            }
            
            const isJoined=alreadyJoinedUser(userId);

            if(!isJoined){
                users.push({userId,socketId:socket.id});
                console.log(users);
                console.log('joined successfully');
            }
        })
     
        socket.on('disconnect',()=>{
            removeUserWhenDisconnects(socket.id);
            console.log(users);
        });
    })
}
