const MovieDetailsModal = ({movie, onClose, isFavorite}) => {

    const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
    
    return (
        <div className="modal modal-open">
            <div className="modal-box w-full max-w-2xl sm:max-w-3xl bg-[var(--root-bg)] shadow-xl text-white">
                <h3 className="font-bold text-xl sm:text-2xl mb-4">{movie.title}</h3>
                {/* Poster */}
                <img src={posterUrl} alt={movie.title} className="rounded-lg mb-4 w-full object-contain max-h-96" />
                {/* Description */}
                <div>
                    <p className="leading-relaxed">{movie.overview}</p>
                    <p className="font-semibold">
                        <span>Release Date</span>{" "}{movie.release_date || "N/A"}
                    </p>
                    <p className="font-semibold">
                        <span>Rating</span>{" "}{movie.vote_average || "N/A"}
                    </p>
                    <p>
                        <span>Genres :</span> {movie.genres ? movie.genres.map(g => g.name).join(", ") : "N/A"}
                    </p>
                    {/* Description */}
                    <div className="flex flex-wrap gap-3 justify-end mt-6">
                        <button className={`btn ${isFavorite ? "btn-error" : "btn-secondary"} bg-[--root-bg] text-white border-0 hover:bg-[--root-bg]`}> 
                            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </button>
                        <button className="btn bg-primary text-white border-0 shadow-none hover:bg-primary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
            {/* Modal Backdrop */}
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};

export default MovieDetailsModal;