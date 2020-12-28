const express = require('express');
const router = express.Router();
const moment = require('moment');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const { userJSScheme} = require('../schemesJS');

//middleware validating user fields
const validateUser = (req, res, next) => {
    const { error } = userJSScheme.validate(req.body);
    console.log("validate user error is", error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

router.get('/', async (req, res) => {
    const users = await User.find({});

    res.render('users/index', { users, moment });
});
router.get('/new', async (req, res) => {
    res.render('users/new');
});
router.post('/',validateUser,  catchAsync(async (req, res, next) => {
        const user = new User(req.body.user);
        await user.save();
        req.flash('success', 'Successfully made a new User');
        res.redirect(`/users/${user._id}`);
    
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('positions');
    console.log("user",user);
    if(!user){
        req.flash('error','Cannot find that User');
        return res.redirect('/users');
    }
    res.render('users/show', { user, moment });
}));
router.get('/:id/edit', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        req.flash('error','Cannot find that User');
        return res.redirect('/users');
    }
    res.render('users/edit', { user,moment });
}));
router.put('/:id', validateUser, catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log("searching user");
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });    
    req.flash('success', 'Successfully updated user');
    res.redirect(`/users/${user._id}`);
}));
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted user');
    res.redirect('/users');
}));

module.exports= router;