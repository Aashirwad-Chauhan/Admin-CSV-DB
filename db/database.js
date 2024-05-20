import mongoose from "mongoose"; 
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = ()=>{
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "CSV_MAIL",
  })
  .then((c) => console.log(`Database Connected with ${c.connection.host}`))
  .catch((e) => console.log(e));
};  