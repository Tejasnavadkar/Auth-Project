import mongoose from "mongoose";




const ConnectDb = async () =>{
    const connectionString = process.env.DB_URL || "your_default_connection_string";
    // console.log('connectString',connectionString)
    // console.log('process.env.DB_URL',process.env.DB_URL)

  try {
    await mongoose.connect(connectionString).then(()=>{
        console.log('Db connection Successfull')
    }).catch((err)=>{
        console.log('Db Connection Error--',err)
    })

  } catch (error:any) {
    console.log("Connection error = ",error)
    throw Error(error)
  }
}

export default {ConnectDb}

