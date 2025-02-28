import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();

//app.use in middleware
app.use(cors({
    origin : process.env.CORS_ORIGIN || "*",
    credentials : true
}))

//when data came from json
app.use(express.json({limit : "16kb"}));
//when data came from url
app.use(express.urlencoded({extended : true , limit : "16kb"}))
//store images(fevicon , logo) in public 
app.use(express.static("public"))



//access cookie from server side and send cookie (perform cred operation on cookie)
app.use(cookieParser())




//routes

import contentrouter from './routes/content.routes.js';

//routes declarartion
app.use("/api/v1" , contentrouter);



export { app  }