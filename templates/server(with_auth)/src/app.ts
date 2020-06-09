#!/usr/bin/env node
require('dotenv').config();

import 'reflect-metadata'
import express from 'express';
import favicon from 'serve-favicon';
import hbs from 'hbs';
import logger from 'morgan';
import path from 'path';
import { createConnection } from 'typeorm';

import ExpressSession from 'express-session';
import passport from './config/passport.config';
import flash from 'connect-flash';
import { TypeormStore } from 'connect-typeorm/out';
import { Session } from './entities/Session.entity';

import indexRoutes from './routes/index.routes';
import authRoutes from './routes/auth.routes';

async function bootstrap() {
  const app_name = require('../package.json').name;
  const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

  //DB connection 
  const connection = await createConnection({
    type: "postgres",
    url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB}`,
    entities: [path.join(__dirname, './entities/**/*.{ts,js}') ],
    migrations: [path.join(__dirname, './migrations/**/*.{ts,js}') ],
    cli: {
        "migrationsDir": "migrations"
    },
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


  // Configure express-session
  app.use(ExpressSession({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: false,
      ttl: 86400 
    }).connect(connection.getRepository(Session)) 
  }));

  // passport
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  // default value for title local
  app.locals.title = 'Express - Generated with kavak typescript generator';

  app.use('/', indexRoutes);
  app.use('/', authRoutes);

  return app;
}

module.exports = bootstrap;
