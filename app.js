const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const moment = require('moment');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const User = require('./models/user');
const Position = require('./models/position');
const { userJSScheme,positionJSScheme } = require('./schemesJS');

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


const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


verifyIsUser = async (req, res, next) => {
    const user = await User.find({ "_id": req.params.id })
        .catch(err => {

        });
    if (user) {
        return next();
    }
    res.status(500).send('Not a valid user');
}

//middleware validating user fields
const validateUser = (req, res, next) => {
    const { error } = userJSScheme.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

const validatePosition = (req, res, next) => {
    const { error } = positionJSScheme.validate(req.body);
    console.log("validatePosition",error,"body",req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/users', async (req, res) => {
    const users = await User.find({});

    res.render('users/index', { users, moment });
});
app.get('/users/new', async (req, res) => {
    res.render('users/new');
});
app.post('/users',validateUser,  catchAsync(async (req, res, next) => {
        const user = new User(req.body.user);
        await user.save();
        res.redirect(`/users/${user._id}`);
    
}));

app.get('/users/:id', catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('positions');
    console.log("user",user);
    res.render('users/show', { user, moment });
}));
app.get('/users/:id/edit', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/edit', { user });
}));
app.put('/users/:id', validateUser, catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    res.redirect(`/users/${user._id}`);
}));
app.delete('/users/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/users');
}));

app.post('/users/:id/positions', validatePosition, catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body.position)
    const user = await User.findById(id);
    const position = new Position(req.body.position);
    user.positions.push(position);
    await position.save();
    await user.save();
    res.redirect(`/users/${user._id}`);

}));
app.delete('/users/:id/positions/:positionId', catchAsync(async (req, res) => {
    const { id, positionId } = req.params;
    await User.findByIdAndUpdate(id, { $pull: { positions: positionId } })
    await Position.findByIdAndDelete(positionId);
    res.redirect(`/users/${id}`);

}));

app.get('/skills', (req, res) => {
    res.render('skills');
});
app.get('/www.sce.ac.il', (req, res) => {
    res.redirect('https://www.sce.ac.il');
})
app.get('/www.bgu.ac.il', (req, res) => {
    res.redirect('https://in.bgu.ac.il/Pages/default.aspx');
})
app.use((err, req, res, next) => {
    console.log("error detacted",err);
    if (!err.msg) err.msg = "oh No!";
    if (!err.statusCode) err.statusCode = 500;
    const { msg, statusCode } = err;

    res.status(statusCode).render('error', { err });
})
app.listen(3000, () => {
    console.log("ON PORT 3000");
})

