const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please teel us your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your name'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: { type: String, default: '' },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm a password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords does not match',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  address: { type: String, default: 'Not set' },
  phone: { type: String, default: 'Not set' },
  dateJoined: { type: Date, default: Date.now() },
  bio: { type: String, default: 'Not Set' },
  dob: { type: Date, default: new Date('02-02-1990') },
  gender: { type: String, default: 'Male' },
  cart: [
    {
      artwork: {
        type: mongoose.Schema.ObjectId,
        ref: 'Artwork',
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

userSchema.pre('save', async function (next) {
  // in case we updating a document , without changing the password , there is no need to hash the password again
  //
  if (!this.isModified('password')) return next();
  // bcrypt.hash will salt the password (adds random string to it) so two similar passwords do not generate the same hash
  this.password = await bcrypt.hash(this.password, 12);
  // there is no point of storing the passwordCnfirm in database in the first place
  // and ofcourse we dont want to hash the passwordConfirm hashing takes time and resources and
  //
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// pre query middleware , to execlude inactive (deleted) users from all find queries
//
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});
userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    if (parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWTTimestamp) {
      return true;
    }
  }
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
