const {io} =require('./server');

module.exports.ioHandler=()=>{
    io.on('connection',(socket)=>{
        console.log(`user joined ${socket.id}`);

        socket.emit('hello','bhsdwalo');

        socket.on('milgeya',(args)=>{
            console.log(`user  ${args} `);
        });
     
        socket.on('disconnect',()=>{
         console.log(`user disconneceted ${socket.id} `);
        });
    })
}
