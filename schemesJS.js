
const Joi = require('joi');
const FullJoi = Joi.extend(require('joi-phone-number')).extend(require('@joi/date'));
module.exports.userJSScheme = Joi.object({
    user: FullJoi.object({

        name: FullJoi.object().keys({
            first: FullJoi.string().required(),
            last: FullJoi.string().required()
        }).required(),

        location: FullJoi.object({
            street: FullJoi.object().keys({
                number: FullJoi.number().required().min(1).max(1000),
                name: FullJoi.string().required()
            }).required(),
            city: FullJoi.string().required(),
            state: FullJoi.string().required()
        }).required(),

        emails: FullJoi.array().items(FullJoi.string()).required(),
  

        login: FullJoi.object().keys({
            username: FullJoi.string().required(),
            password: FullJoi.string().required()
        }).required(),

        birthday: FullJoi.date().iso(),

        phone: FullJoi.string().required().phoneNumber(),

    }).required()
});


module.exports.positionJSScheme = Joi.object({
    position: FullJoi.object({
        jobTitle: FullJoi.string().required(),
        jobDescription: FullJoi.string().required(),
        componyName: FullJoi.string().required(),
        startDate: FullJoi.date().iso().required(),
        endDate: FullJoi.date().iso().allow("").allow(null),
        currentPosition: FullJoi.boolean()      
    }).required()
});