import express from "express"; // Importing Router from express
import { getContent } from '../controllers/content.controller.js'; // Importing getContent function from content.controller 
import { getGenres } from '../controllers/genre.controller.js';

const router = express.Router();

router.get("/genres", getGenres);  // GET route for genres
router.get("/content/:genreId", getContent);  // POST route for content

// In routes file
router.get("/test", (req, res) => {
    res.send("Test working ✅");
  });
  


export default router;
