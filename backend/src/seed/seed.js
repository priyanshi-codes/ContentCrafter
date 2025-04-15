import mongoose from "mongoose";
import dotenv from "dotenv"
import { DB_NAME } from "../constant.js";
import { Genre } from "../models/genre.model.js";
import { Content } from "../models/content.model.js";


dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI;

const seed = async ()=>{
    try {
        await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
        console.log("MongoDB connected")

        //Inserting Genres

        const genre1= await Genre.create({name:"Technology",
             description: "All about tech innovations and coding."
        })
        const genre2= await Genre.create({name:"Health",
            description: "Health tips and fitness articles."
        })

        //Inserting Content for those genres

        await Content.create([
            {
                genre: genre1._id,
                title:"Intro to AI",
                content : "Artificial Intelligence is used in many feilds...."

            },
            {
                genre: genre1._id,
                title: "Web Development",
                content: "Frontend, Backend, and DevOps are core parts."
              },
              {
                genre: genre2._id,
                title: "Yoga Benefits",
                content: "Yoga helps in reducing stress and anxiety."
              }
        ]);

        console.log("Send data inserted successfully")
        process.exit(0)
        
    } catch (error) {
         console.error("Error in inserting data: ", error);
         process.exit(1);
    }
}

seed();
