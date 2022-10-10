import express from 'express'
import dotenv from "dotenv"
import mongoose from 'mongoose'
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import restaurantsRoute from "./routes/restaurants.js"
import tablesRoute from "./routes/tables.js"

const app= express()
dotenv.config()

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to mongoDB")
    } catch (error) {
        throw error
    }
};

mongoose.connection.on("disconnected", ()=>{
    console.log('mongoDB disconnected!')
})


app.get("/users", (req,res)=>{
    res.send("hello")
})

//middlewares 
app.use(express.json())


app.use("/api/auth" , authRoute);
app.use("/api/users" , usersRoute);
app.use("/api/restaurants" , restaurantsRoute);
app.use("/api/tables" , tablesRoute);


app.listen(8800, ()=>{
    connect()
    console.log("Connected to backend.")
})