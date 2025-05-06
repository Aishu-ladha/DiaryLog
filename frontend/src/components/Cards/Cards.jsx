import React from 'react';
import { FaThumbtack } from 'react-icons/fa';
import CardActions from './CardActions';
import './Cards.css'; // Import the CSS file for styling
const Cards = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className="bg-[#1e1e2f] text-white p-4 rounded-lg shadow-lg relative max-w-md w-full">
      {/* Pin Icon */}
      <button
        onClick={onPinNote}
        className={`absolute top-3 right-3 ${isPinned ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300`}
        title={isPinned ? 'Unpin Note' : 'Pin Note'}
      >
        <FaThumbtack />
      </button>

      <h3 className="text-xl font-semibold text-[#DCCBFF]">{title}</h3>
      <p className="text-sm text-gray-400">{date}</p>

      {/* <p className="mt-3 text-[#A2A2BC]">{content}</p> */}
      <p className="mt-3 text-[#A2A2BC] content-overflow-scrollable content-overflow">{content}</p>

      <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#2a2a3e] text-sm px-2 py-1 rounded text-[#DCCBFF]"
            >
              #{tag} {/* Ensure # is part of the tag */}
            </span>
          ))}
        </div>


      <CardActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default Cards;
