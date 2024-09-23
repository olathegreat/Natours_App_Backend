const replaceTemplate = require('./modules/replaceTemplate');

// // FILE READING AND WRITING

// const fs = require('fs');

//  const readText = fs.readFileSync("./index.txt","utf-8");
//  console.log(readText);



// //  synchronous

//  

// const writeText = `This is a new text ${readText} .\n Next line`;
//  fs.writeFileSync("./write.txt",writeText);
// const hello = "hello world"
// console.log(hello);


// // asynchronous

//  fs.readFile("./index.txt","utf-8",(err,data)=>{
//             if(err){
//                 console.log(err);
//             }

//             console.log(data)
//  })

//  console.log("This program is running");




// CREATING A WEB SERVER WITH API  URL


const http = require('http');
const url = require('url');
const fs = require('fs');



const arrayObj =  fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const tempOverview =  fs.readFileSync(`${__dirname}/template/overview.html`,'utf-8');
const tempProduct =  fs.readFileSync(`${__dirname}/template/product.html`,'utf-8');
const tempProductCard =  fs.readFileSync(`${__dirname}/template/productcard.html`,'utf-8');

const dataArrayObj = JSON.parse(arrayObj);




const server = http.createServer((req,res)=>{
    
    // const pathName = req.url
    const {query, pathname} = url.parse(req.url,true)
//   OVERVIEW
    if(pathname==="/" || pathname==="/overview"){
        res.writeHead(200, {'Content-Type':'text/html'})

        const cardsHtml = dataArrayObj.map((item)=>(
            replaceTemplate(tempProductCard,item)
        )).join("")


        const output = tempOverview.replace(/{%PRODUCTCARDS%}/g,cardsHtml)

        res.end(output)




        // PRODUCT
    }  else if(pathname==="/product"){
        const product = dataArrayObj[query.id]
        res.writeHead(200, {'Content-Type':'text/html'})

        const output = replaceTemplate(tempProduct,product)
        res.end(output)




// API
    } else if(pathname==="/api"){

        
        res.writeHead(200,{'Content-Type':'application/json'})
        res.end(arrayObj)
        // console.log(arrayObj)

    } else{
        res.writeHead(404,{'Content-Type':'text/html'})
        res.end('<h1>Page not found</h1>')
    }
})

server.listen(8000,"localhost",()=>{
      console.log("Server is running on port 8000😆");
})