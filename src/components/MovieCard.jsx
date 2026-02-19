import React from "react";

const movieCard = ({movie}) => {
    const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  
    return <div className="group rounded-2xl overflow-hidden shadow-lg">
          <img
          className="w-full h-96 object-cover hover:scale-110
          duration-300"
          src={posterUrl} alt={movie.title} />
    </div>

};
export default movieCard;   