'use strict';

let crypto = require("crypto");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({

  name: { type: String, default: "" },
  email: { type: String, default: "", unique: true },

  salt: { type: String, required: true },
  hashedPassword: { type: String, default: "" },

  role: { type: String, enum: ['user', 'admin'], default: "user" },


  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

/**
 * Virtuals
*/
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');


/**
 * Pre-save hook
**/
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();
    // if (!validatePresenceOf(this.hashedPassword))
    //   next(new Error('Invalid password'));
    // else
    next();
  });

/**
* Methods
**/
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
  **/
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
  **/
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    let salt = new Buffer.from(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 100000, 128, 'sha512').toString('base64');
  }
}

module.exports = mongoose.model("User", UserSchema);