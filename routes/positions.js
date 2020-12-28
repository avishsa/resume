const express = require('express');
const router = express.Router({mergeParams: true});


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const Position = require('../models/position');
const { positionJSScheme} = require('../schemesJS');

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

router.post('/', validatePosition, catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body.position)
    const user = await User.findById(id);
    const position = new Position(req.body.position);
    user.positions.push(position);
    await position.save();
    await user.save();
    res.redirect(`/users/${user._id}`);

}));
router.delete('/:positionId', catchAsync(async (req, res) => {
    const { id, positionId } = req.params;
    await User.findByIdAndUpdate(id, { $pull: { positions: positionId } })
    await Position.findByIdAndDelete(positionId);
    res.redirect(`/users/${id}`);

}));
module.exports= router;