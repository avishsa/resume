const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CompanySchema = new Schema ({
    title: String, 
    description: String,
    website: Array
});

module.exports = mongoose.model('Company',CompanySchema);

