
const mongoose = require('mongoose');
const User = require('../models/user');
const { generate } = require('./userGenerator');
const NUM_USERS = 5;
mongoose.connect('mongodb://localhost:27017/resumeDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await User.deleteMany({});
    for (let i = 0; i < NUM_USERS; i++) {
        const usr = await generate();  
        await usr.save();
    }
}
seedDB();
