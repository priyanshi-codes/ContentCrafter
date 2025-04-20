import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";
import { Genre } from "../models/genre.model.js";
import { Content } from "../models/content.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Utility function to avoid duplicate genres
const findOrCreateGenre = async (name, description) => {
    let genre = await Genre.findOne({ name });
    if (!genre) {
        genre = await Genre.create({ name, description });
    }
    return genre;
};

const seed = async () => {
    try {
        await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connected");

        // Find or create genres
        const genre1 = await findOrCreateGenre("Technology", "All about tech innovations and coding.");
        const genre2 = await findOrCreateGenre("Health", "Health tips and fitness articles.");

        // Optional: Remove old content if needed before inserting new
        await Content.deleteMany({}); // Only use if you want a fresh start every time

        // Insert content
        await Content.create([
            {
                genre: genre1._id,
                title: "Intro to AI",
                content: `Artificial Intelligence is used in many fields...
                hello welcome to the world of ai`
            },
            {
                genre: genre1._id,
                title: "Web Development",
                content: `Frontend, Backend, and DevOps are core parts. 
                hello welcome to the world of web development
                `
            },
            {
                genre: genre2._id,
                title: "Yoga Benefits",
                content: `Yoga helps in reducing stress and anxiety.
            
                hello welcome to the world of yoga
                `
            }
        ]);

        console.log("Seed data inserted successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error in inserting data: ", error);
        process.exit(1);
    }
};

seed();
