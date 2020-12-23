const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Position = require('./position');


const UserSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    location: {
        street: {
            number: Number,
            name: String
        },
        city: String,
        state: String,
    },
    emails: [String],
    websites: [{
        name: String,
        url: String
    }],
    login: {
        username: String,
        password: String,
    },
    birthday:
    {
        type: Date,
        min: '1900-01-01',
        max: '2020-01-01'
    },
    phone: String,
    picture: {
        large: String,
        medium: String,
        thumbnail: String
    },
    skills: [String],
    positions: [{
        type: Schema.Types.ObjectId,
        ref: 'Position'
    }]
});

UserSchema.post('findOneAndDelete', async (doc) => {
    console.log("delete user!", doc);
    if (doc) {
        await Position.remove({
            _id: {
                $in: doc.positions
            }
        })
    }

});

module.exports = mongoose.model('User', UserSchema);