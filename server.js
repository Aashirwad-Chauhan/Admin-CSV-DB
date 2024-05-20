import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./db/database.js";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";
import morgan from "morgan";
import {config} from "dotenv";


const app = express();  


config({
    path: "./config.env",
});

connectDB();

app.use(express.json()); 
app.use(morgan("dev"));
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
        process.env.FRONT_END_URL,
    ],
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true,
}));


app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);


app.get("/", (req, res)=>{
    res.send("Konichiva!!");
});

// console.log(process.env.PORT);
let Port = process.env.PORT || 3000;

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(Port, ()=>{
    console.log("At the Server!!");
    console.log(`PORT: ${process.env.PORT} | MODE: ${process.env.NODE_ENV}` );
});

