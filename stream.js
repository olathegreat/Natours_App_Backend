const fs = require('fs')
const server = require('http').createServer();



server.on('request', (req, res)=>{
    //  Solution 1 loading entire file

    // fs.readFile('./stream.txt', (err, data)=>{
    //     if(err) console.log(err);
    //     res.end(data);
    // })

    // solution 2 using stream

    // const readable = fs.createReadStream("./stream.txt")

    // readable.on('data', chunk =>{
    //     res.write(chunk);
    // })
    // readable.on('end', ()=>{
    //     res.end()
    // })

    // readable.on('error', err=>{
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end("file not found")
    // })

    // solution 3 using pipe to solve back pressure
    const readable = fs.createReadStream("./stream.txt")
    readable.pipe(res);


})


server.listen(8000, 'localhost', ()=>{
    console.log("server is up and running");
})