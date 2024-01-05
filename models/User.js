const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user','selger','admin'],
    },
    products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }],
    });

UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (error, hash) {
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;