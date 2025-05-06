// import { get } from 'mongoose';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const AddCardModal = ({diarydata, getdiaries, isOpen, onClose ,type}) => {
  console.log("Diary data:", diarydata);
  const [title, setTitle] = useState(diarydata? diarydata.title : "");
  const [content, setContent] = useState(diarydata ? diarydata.content : '');
  const [tags, setTags] = useState(diarydata ? diarydata.tags.join(', ') : '');
  const [error, setError] = useState([]);


  useEffect(() => {
    if (diarydata && type === 'edit') {
      setTitle(diarydata.title || '');
      setContent(diarydata.content || '');
      setTags((diarydata.tags || []).join(', '));
    }
  }, [diarydata, type]);


  const addNote = async () => {
    try{
      const response = await axiosInstance.post("/diary",{
        title,
        content,
        tags,
    });
      console.log("Fetched data:", response.data); 
      if(response.data && response.data.diary){
        // onAddCard(response.data.diary);
        getdiaries();
        onClose(); 
      }
    }
    catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
       }
      else{
        setError('Something went wrong. Please try again later.');
    }
  }
  };
    const editNote = async () => { 
      const noteId = diarydata._id; // Get the note ID from the diarydata prop
      console.log("Note ID:", noteId);  // Log the noteId
      try{
      const response = await axiosInstance.put(`/edit-diary/${noteId}`
,{
        title,
        content,
        tags,
    });
      console.log("Fetched data:", response.data); 
      if(response.data && response.data.diary){
        // onAddCard(response.data.diary);
        getdiaries();
        onClose(); 
      }
    }
    catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
       }
      else{
        setError('Something went wrong. Please try again later.');
    }
  }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
   
    if(!title) {
      setError("Title is required");
    }
    if(!content) {
      setError("Content is required");
    }
    setError("");

    if (type === 'edit') {
        editNote();
    }
    else{
        addNote();

    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        {/* <div className="bg-[#1e1e2f] p-6 rounded-lg shadow-lg w-96"> */}
        <div className="bg-[#1e1e2f] p-6 rounded-lg shadow-lg w-full max-w-2xl">

          <h3 className="text-xl text-[#DCCBFF] mb-4">Add a New Note</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="text-[#A2A2BC]">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-[#2a2a3e] text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="text-[#A2A2BC]">Content</label>
              {/* <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 rounded bg-[#2a2a3e] text-white"
                required
              /> */}

                <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 rounded bg-[#2a2a3e] text-white min-h-[150px]"
                required
                />

            </div>

            <div>
              <label htmlFor="tags" className="text-[#A2A2BC]">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 rounded bg-[#2a2a3e] text-white"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-300 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#DCCBFF] text-[#181825] py-2 px-4 rounded"
              >
                {type === "edit" ? "Update" : "Add Note"}
              </button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddCardModal;
