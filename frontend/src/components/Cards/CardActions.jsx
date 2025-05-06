import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const CardActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-3 mt-4">
      <button onClick={onEdit} className="text-blue-400 hover:text-blue-300">
        <FaEdit size={18} />
      </button>
      <button onClick={onDelete} className="text-red-400 hover:text-red-300">
        <FaTrash size={18} />
      </button>
    </div>
  );
};

export default CardActions;
