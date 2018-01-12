const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    role: { type: String, required: true, enum: ["Client", "Support", "Root"] },
    username: { type: String, index: { unique: true }, required: true },
    email: { type: String, index: { unique: true } },
    password: { type: String, required: true },
    location: { type: String, enum: ["US", "CHINA"]}
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.usePassword) {
        // proceed further only if the password is modified or the user is new
        if (!user.isModified('password')) return next();
        return bcrypt.genSalt()
        .then((salt) => {
            return bcrypt.hash(user.password, salt)
        })
        .then((hash) => {
            // replace a password string with hash value
            user.password = hash;
            return next();
        })
        .catch(err => {
            return next(err);
        })
    }
    return next();
});

module.exports = mongoose.model('User', UserSchema);