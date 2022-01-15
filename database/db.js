const mongoose=require('mongoose')
const db="mongodb+srv://Sommy21:Soham@2112@cluster0.m8r2j.mongodb.net/antakshari?retryWrites=true&w=majority";

// const db=process.env.URI;

mongoose.connect(db,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology: true,
    // useFindAndModify:false 
}).then(()=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log("No connection");
})