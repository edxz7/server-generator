#!/usr/bin/env node
require('dotenv').config();

import 'reflect-metadata'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import hbs from 'hbs';
import logger from 'morgan';
import path from 'path';
import { createConnection } from 'typeorm';

createConnection({
  type: "postgres",
  url: `postgres://postgres:password@localhost:5432/${process.env.DB}`,
  entities: ["dist/entities/**/*.js"],
  synchronize: true
})
  .then(connection => {
  console.log("connected to PostgreSQL! Database options: ", connection.options )
})
  .catch(err => {
    console.log(`Error connecting to postgresql`, err)
  })


const app_name = require('../package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with kavak typescript generator';



import index from './routes/index';
app.use('/', index);


module.exports = app;
