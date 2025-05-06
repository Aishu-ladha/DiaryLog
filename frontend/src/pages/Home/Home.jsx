import React, { useEffect, useState } from 'react';
import Card from '../../components/Cards/Cards';
import Navbar from '../../components/Navbar/Navbar';
import AddCardModal from '../../components/Cards/AddCardModal';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  const handleEdit = (noteDetails) => {
    console.log("Edit clicked", noteDetails);
    setIsModalOpen({
      isOpen: true,
      data: noteDetails,
      type: 'edit', // 'add' or 'edit'
    });
  };

  const handlePin = () => alert('Pin/Unpin clicked');

  const handleAddCard = (newCard) => {
    setCards([...cards, newCard]); // Add the new card to the state
  };
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    data:null,
    type: 'add', // 'add' or 'edit'
  });
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getdiaries = async ()=>{
    try{
      const response = await axiosInstance.get("/diary");
      // console.log("Fetched data:", response.data); 
      if(response.data && response.data.diaries){
        setCards(response.data.diaries);
      }
    }
    catch(error){
      console.error("Error fetching diaries:", error);
    }
  };

  const handleDelete = async(diarydata)=>{
   const noteId = diarydata._id; // Get the note ID from the diarydata prop
   console.log("Notennnn ID:", noteId);  // Log the noteId
   
    try{
      const response = await axiosInstance.delete(`/diary/${noteId}`);
      console.log("Fetched data:", response.data); 
      if(response.data && !response.data.error){
        getdiaries();
      }
    }
    catch(error){
      if(error.response && error.response.data && error.response.data.message){
        console.error(error.response.data.message);
       }
      else{
        console.error('Something went wrong. Please try again later.');
    }
  }
}
  useEffect(() => {
    getdiaries();
    return () => {}
  }, []);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#181825] p-6 flex justify-center items-center">
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((item) => (
          // console.log("Item:", item),
          <Card 
            key={item._id}
            title={item.title}
            date={item.createdOn}
            content={item.content} 
            tags={item.tags}
            isPinned={item.isPinned || false}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}

            onPinNote={handlePin}
          />
        ))}


      
       </div>
       <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 bg-[#DCCBFF] text-[#181825] rounded-full p-4 shadow-lg hover:bg-[#bba7ff]"
      >
        +
      </button>

      {/* Modal for adding card */}
      <AddCardModal
        type={isModalOpen.type}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddCard={handleAddCard}
        getdiaries={getdiaries}
        diarydata={isModalOpen.data} // Pass the data to the modal
      />
    </div>
    </>
  );
};

export default Home;
