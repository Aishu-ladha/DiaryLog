const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.json');

require('dotenv').config();

const User = require('./models/user.model.js');
const Diary = require('./models/dairy.model.js');

mongoose.connect(config.connectionString);


// const diaryRoutes = require('./routes/diaryRoutes');


const app = express();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities.js');
app.use(express.json());
// const PORT = process.env.PORT || 5000;
// Connect DB
// connectDB();

app.use(cors({
    origin: 'http://localhost:5174', // Allow all origins (or specify exact URL instead of '*')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Diary API' });
});

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
   
    if(!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.json({ message: "User already exists",error: true });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user},process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });

    return res.json({
        error: false,
        user,
        accessToken,    
        message: "User created successfully",
    });
    
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User not found",error: true });
    }

    if (user.email == email && user.password == password) {
        // return res.json({ message: "Invalid credentials",error: true });
    const userinfo = {user:user};
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    const accessToken = jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });

    return res.json({
        error: false,
        email,
        accessToken,
        message: "Login successful",

    });
}
else{
    return res.status(400).json({
        error: true,
        message: "Invalid credentials",
    })
}
});

app.get("/user", authenticateToken, async (req, res) => { 
    const {user} = req.user;
    console.log("Authenticated user:", user); 
    try{
        const userData = await User.findOne({_id: user._id});
        if (!userData) {
            return res.status(401).json({ message: "User not found" });
        }
        return res.json({
            error: false,
            user: {
                _id: userData._id,
                fullName: userData.fullName,
                email: userData.email,
                createdOn: userData.createdOn,
            },
            message: "User fetched successfully",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
}
);
app.post("/diary", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const {user} = req.user;
    // console.log("Request body:", req.body);  // Log the incoming body
    // console.log("Authenticated user:", req.user); 
    // const userId = req.user.user._id;
    if(!title || !content) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try{
        const diary = new Diary({
            title,
            content,
            tags:tags || [],
            userId: user._id,
        });
        await diary.save();
        return res.json({
            error: false,
            diary,
            message: "Diary created successfully",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        })
    }
    await diary.save();

    return res.json({
        error: false,
        diary,
        message: "Diary created successfully",
    });
});

app.put("/edit-diary/:id", authenticateToken, async (req, res) => {
    const { title, content, tags ,isPinned } = req.body;
    const {user} = req.user;
    const diaryId = req.params.id;

    console.log("Diary ID:", diaryId);  // Log the diaryId
    console.log("Authenticated User ID:", user._id); 
    if(!title || !content || !tags) {
        return res.status(400).json({ message: "No changes provided" });
    }

    try{
        const diary = await Diary.findOne({ _id: diaryId, userId: user._id, });
        console.log(diary);
        if (!diary) {
            return res.status(404).json({ message: "Diary not found" });
        }
        if (title) diary.title = title;
        if (content) diary.content = content;
        if (tags) diary.tags = tags;
        if(isPinned) diary.isPinned = isPinned;
        await diary.save();
        return res.json({
            error: false,
            diary,
            message: "Diary updated successfully",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});




app.get("/diary", authenticateToken, async (req, res) => {
    const {user} = req.user;
    try{

        const diaries = await Diary.find({ userId: user._id }).sort({ isPinned: -1});
        // console.log("Authenticated User ID:", user._id);
        // console.log(" diaries:", diaries);  // Log the fetched diaries
        return res.json({
            error: false,
            diaries,
            message: "Diaries fetched successfully",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});


app.delete("/diary/:id", authenticateToken, async (req, res) => {
    const {user} = req.user;
    const diaryId = req.params.id;
    console.log("Diary ID:", diaryId);  // Log the diaryId
    console.log("Authenticated User ID:", user._id); 
    try{
        const diary = await Diary.findOne({ _id: diaryId, userId: user._id });
        console.log("Diary from DB:", diary);  
        if (!diary) {
            return res.status(404).json({ message: "Diary not found" });
        }
        await Diary.deleteOne({ _id: diaryId , userId: user._id });
        return res.json({
            error: false,
            message: "Diary deleted successfully",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});


app.put("/diary/pin/:id", authenticateToken, async (req, res) => {
    const {user} = req.user;
    const diaryId = req.params.id;
    const {isPinned} = req.body;
    console.log("Diary ID:", diaryId);  // Log the diaryId
    console.log("Authenticated User ID:", user._id); 

    // if(!isPinned) {
    //     return res.status(400).json({ message: "No changes provided" });
    // }


    try{
        const diary = await Diary.findOne({ _id: diaryId, userId: user._id });
        if (!diary) {
            return res.status(404).json({ message: "Diary not found" });
        }
        if (isPinned) {
            diary.isPinned = !diary.isPinned || false;
        }
        await diary.save();
        return res.json({
            error: false,
            diary,
            message: "Diary pinned/unpinned successfully",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

app.listen(8000);
module.exports = app;

// app.use('/api/diary', diaryRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
