const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EducationSchema = new Schema ({
    institueTitle: String, 
    institueDescription: String,
    departmentTitle: String,
    diplomaTitle: String,
    diplomaImgSrc: String,
    linkedIn: String,
    startDate: Date,
    endDate: Date,
});

module.exports = mongoose.model('Education',EducationSchema);

