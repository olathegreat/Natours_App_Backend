const fs = require('fs');
const dotenv = require('dotenv');
const Tours = require('../../models/tourModel');
const Users = require('../../models/userModel');
const Reviews = require('../../models/reviewModel');


dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

// const DB = process.env.DATABASE_LOCAL.replace('<password>', process.env.DATABASE_PASSWORD);

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log('DB connected'));

//   READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT TOURS
const importData = async () => {
    try{
        await Tours.create(tours);
        await Users.create(Users);
        await Reviews.create(Reviews);

    }catch(err){
        console.log(err);

    }
    process.exit();
}


// Delete Data from DB
const deleteData = async () => {
    try{
        await Tours.deleteMany();
        await Users.deleteMany();
        await Reviews.deleteMany();
    }catch(err){
        console.log(err);

    }
    process.exit();
}

if(process.argv[2] === 'delete')   {
    deleteData()
} else if(process.argv[2] === 'import') {
    importData()
}


