import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const range = 3;
  const start = Math.max(1, currentPage - range);
  const end = Math.min(totalPages, currentPage + range);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex justify-center mt-4 flex-wrap gap-1">
      <button
        className="btn bg-gray-800 border-0 shadow-none"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        «
      </button>
      {start > 1 && <button className="btn btn-disabled bg-gray-800 border-0 shadow-none">...</button>}
      {pages.map((page) => (
        <button
          onClick={() => onPageChange(page)}
          className={`btn border-0 shadow-none hover:bg-[--root-bg] ${page === currentPage ? "bg-primary text-white border-0 shadow-none" : "bg-gray-800"}`}
          key={page}
        >
          {page}
        </button>
      ))}
      {end < totalPages && <button className="btn btn-disabled bg-gray-800 border-0 shadow-none">...</button>}
      <button
        className="btn bg-gray-800 border-0 shadow-none"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;