import React from "react";
import "./pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [...Array(totalPages).keys()].map(n => n + 1);

  return (
    <div className="pagination-container">
      <button
        disabled={currentPage === 1}
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {pages.map(page => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}