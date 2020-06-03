#!/usr/bin/env node
require('dotenv').config();

import 'reflect-metadata'
import express from 'express';
import favicon from 'serve-favicon';
import hbs from 'hbs';
import logger from 'morgan';
import path from 'path';
import { createConnection } from 'typeorm';

import index from './routes/index.routes';

async function bootstrap() {
  const app_name = require('../package.json').name;
  const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

  //DB connection 

  const connection = await createConnection({
    type: "postgres",
    url: `postgres://postgres:password@localhost:5432/${process.env.DB}`,
    entities: [path.join(__dirname, './entities/*.{ts,js}') ],
    synchronize: true
  });
  // display DB info
  console.log("connected to PostgreSQL! Database options: ", connection.options );

  // setup an express app
  const app = express();

  // Middleware Setup
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Express View engine setup
  app.use(require('node-sass-middleware')({
    src:  path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true
  }));
        

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');
  hbs.registerPartials( path.join(__dirname, 'views/partials' ) )
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

  // default value for title local
  app.locals.title = 'Express - Generated with kavak typescript generator';

  app.use('/', index);

  return app;
}

module.exports = bootstrap;
