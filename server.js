const dotenv = require('dotenv');
const importData = require('./dev-data/data/import-dev-data');

dotenv.config({ path: './config.env' });


const app = require('./express');
const mongoose = require('mongoose')

// const DB = process.env.DATABASE_LOCAL.replace('<password>', process.env.DATABASE_PASSWORD);

const DB = process.env.DATABASE_LOCAL

process.on('uncaughtException', err=>{
  console.log('uncaughtException');
  console.log(err.name, err.message);
 
    process.exit(1);
  
})

mongoose.connect(DB,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => console.log('DB connected')) 




const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err=>{
  console.log('unhandledRejection');
  console.log(err.name, err.message);
  server.close(()=>{
    process.exit(1);
  })
})

