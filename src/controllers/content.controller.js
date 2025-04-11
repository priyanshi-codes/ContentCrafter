import {Content} from "../models/content.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const getContent = async (req, res)=>{
    try {
        const {genreId}= req.params;
        const contents = await Content.find({ genre: genreId });
        if(contents.length === 0){
            return res.status(404)
            .json(new ApiError(404 , "No content found for this genre"))
        }
        return res.status(200)
        .json(new ApiResponse(200, contents))
        
    } catch (error) {
        console.log(error);
        return res.status(500).
        json(new ApiError(500 , "No content found for this genre"))    
    }
}

export  {getContent}