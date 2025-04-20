import express from "express"; // Importing Router from express
import { getContent , getContentById } from '../controllers/content.controller.js'; // Importing getContent function from content.controller 
import { getGenres } from '../controllers/genre.controller.js';

const router = express.Router();

router.get("/genres", getGenres);  // GET route for genres
router.get("/content/:genreId", getContent);  // get route for content
router.get("/content/detail/:contentId",getContentById) // get route for content by id
  


export default router;
