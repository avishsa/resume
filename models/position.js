const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PositionSchema = new Schema ({
    jobTitle: String,
    jobDescription: String,
    componyName: String,    
    startDate: {
        type: Date,
        min: '1900-01-01',
        
    },
    endDate: {
        type: Date,
        min: '1900-01-01',
        
    },
    currentPosition: Boolean,    
    /**
     * componyId: String
     * achievements: Array,
     * skills: Array,
     * contacts: Array
     */
});

module.exports = mongoose.model('Position',PositionSchema);