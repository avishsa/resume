const axios = require('axios');
const User = require('../models/user');
const moment = require('moment');
module.exports.generate = async() => {
    const data = await axios.get('https://randomuser.me/api/');    
    const usrData = data.data.results[0];
    const {name, location, email, login, dob, phone, picture} = usrData;    
    const usr = new User({
        name : {first: name.first, last: name.last },
        location : {street:location.street,city:location.city,state:location.state},
        emails: [email],
        websites: [],
        login: {username:login.username, password:login.password},
        birthday: new Date(dob.date),
        phone,
        picture,
        skills: []
    });
    return usr;
}
