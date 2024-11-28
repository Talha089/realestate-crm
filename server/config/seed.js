/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

const User = require('../api/user/user.model');

/*  Create Admin  */
User.findOne({ role: 'admin' }).exec(async (error, adminFound) => {
  if (!adminFound) {
   
    let adminObj = new User({
      role: 'admin',
      designation: 'CEO',
      name: 'Muhammad Mousa',
      password: 'Alpha1234.',
      phone: '+923170000067',
      email: 'mmousa@softtik.com'
    });
    
    adminObj.save((err, saved) => {
      if (saved) console.log('Admin Created');
    });
  }
});
