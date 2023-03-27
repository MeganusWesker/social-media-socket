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

const removeUserWhenDisconnects=(socketId)=>{
    console.log(`user socket id is ${socketId}`);
   let newUsers=users.filter((item)=>item.socketId !==socketId);
   users=newUsers;
}

module.exports.ioHandler=()=>{
    io.on('connection',(socket)=>{
        console.log(`user joined ${socket.id}`);

   

        socket.on('addUser',(userId)=>{
            console.log(userId);
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
