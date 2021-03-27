if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const users = require('./routes/users');
const positions = require('./routes/positions');

const dbUrl = process.env.NODE_ENV === "production" ? process.env.DB_MONGO : 'mongodb://localhost:27017/resumeDB';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const secret = process.env.SECRET || 'notAreallyGoodSecret';
const sessionCofig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() +1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionCofig));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    console.log("Home!!!!!");
    res.render('home');
});

app.use('/users',users);
app.use('/users/:id/positions',positions);


app.get('/skills', (req, res) => {
    res.render('skills');
});
app.get('/www.sce.ac.il', (req, res) => {
    res.redirect('https://www.sce.ac.il');
})
app.get('/www.bgu.ac.il', (req, res) => {
    res.redirect('https://in.bgu.ac.il/Pages/default.aspx');
})
/*app.all('*', (req, res, next) => {
    console.log("Page not found");
    next(new ExpressError('Page not found', 404))
})*/
app.use((err, req, res, next) => {
    console.log(err);
    const { msg = "oh No!", statusCode = 500 } = err;
    
    res.status(statusCode).render('error', { err });

})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("ON PORT 3000");
})

