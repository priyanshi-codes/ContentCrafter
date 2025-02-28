import {Router} from 'express';
import { getContent } from '../controllers/content.controller';
import { getGenres } from '../controllers/genre.controller';

const router = Router();


router.get("/genres", getGenres);  // GET route for genres
router.post("/content", getContent);  // POST route for content


export default router;
