const {io} =require('./server');

let users=[];

const alreadyJoinedUser=(userId)=>{
    let isJoined=false;

    users.forEach((item)=>{
        if(item.userId==userId){
            isJoined=true;
        }
    })

    return isJoined;
}

const removeUserWhenDisconnects=(socketId)=>{
   users=users.filter((item)=>item.socketId !==socketId);
}

module.exports.ioHandler=()=>{
    io.on('connection',(socket)=>{
        console.log(`user joined ${socket.id}`);

   

        socket.on('addUser',(userId,socketId)=>{
            console.log(userId,socketId);
            const isJoined=alreadyJoinedUser(userId);

            if(!isJoined){
                users.push({userId,socketId});
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
