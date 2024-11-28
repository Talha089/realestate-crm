'use strict';

const _ = require('lodash');
const path = require('path');
const express = require('express');

const all = {
  env: process.env.NODE_ENV,

  // Frontend path to server
  assets: express.static(__dirname + '/../../dist'),
  view: path.normalize(__dirname + '/../../dist/index.html'),

  // Should we populate the DB with sample data ?
  seedDB: true,

  secrets: {
    session: 'CRM_s3cr3t_2023',
    refresh: 'CRM_s3cr3t_2023'
  },


  project_name: 'CRM',
  support_title: 'Support Team',
  // mail_from_email: 'do-not-reply@remotejoblab.com',
  mail_from_email: 'do-not-reply@crm.co.uk',
  mail_from_name: 'remotejoblab',
  mail_logo: 'https://www.crm.co.uk/logo.png',

  encPass: 's1XrWeMEc2aJn1tu5HMp',
  rpc_secret: "4b8cf527e04e4a8abe40d9b2030129fckf546pwsdafe",
};

/* Export the config object based on the NODE_ENV */
/*================================================*/

module.exports = _.merge(
  all,
  require(`./const.js`),
  require(`./${process.env.NODE_ENV}.js`) || {}
);
