import {Content} from "../models/content.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";



//Get content list by genre(with preview)
const getContent = async (req, res)=>{
    try {
        const {genreId}= req.params;
        //Find all content for this genre
        const contents = await Content.find({ genre: genreId });
        if(contents.length === 0){
            return res.status(404)
            .json(new ApiError(404 , "No content found for this genre"))
        }

        //Create preview version of content
      const contentPreviews= contents.map(content=>{
        const preview ={
            _id: content._id,
            title: content.title,
            //create a short preview(first 100 charc)
            preview: content.content.substring(0,100)+(content.content.length >100 ?'...':'')
        };
        return preview;
      })

        return res.status(200)
        .json(new ApiResponse(200, contentPreviews))
        
    } catch (error) {
        console.log(error);
        return res.status(500).
        json(new ApiError(500 , "No content found for this genre"))    
    }
}
//Get full content by id 
const getContentById = async (req,res)=>{
    try {
        const {contentId}= req.params;
        //Find content by id
        const content = await Content.findById(contentId);
        if(!content){
            return res.status(404)
            .json(new ApiError(404 , "No content found for this genre"))
        }
        return res.status(200).json(new ApiResponse(200, content))
        
    } catch (error) {
        console.log(error);
        return res.status(500).
        json(new ApiError(500 , "No content found for this genre"))
        
    }
}

export  {getContent,getContentById}