"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_1 = __importDefault(require("express"));
var serve_favicon_1 = __importDefault(require("serve-favicon"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var typeorm_1 = require("typeorm");
typeorm_1.createConnection({
    type: "postgres",
    url: "postgres://postgres:password@localhost:5432/" + process.env.DB,
    entities: ["dist/entities/**/*.js"],
    synchronize: true
})
    .then(function (connection) {
    console.log("connected to PostgreSQL! Database options: ", connection.options);
})
    .catch(function (err) {
    console.log("Error connecting to postgresql", err);
});
var app_name = require('../package.json').name;
var debug = require('debug')(app_name + ":" + path_1.default.basename(__filename).split('.')[0]);
var app = express_1.default();
// Middleware Setup
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
// Express View engine setup
app.use(require('node-sass-middleware')({
    src: path_1.default.join(__dirname, 'public'),
    dest: path_1.default.join(__dirname, 'public'),
    sourceMap: true
}));
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(serve_favicon_1.default(path_1.default.join(__dirname, 'public', 'images', 'favicon.ico')));
// default value for title local
app.locals.title = 'Express - Generated with kavak typescript generator';
var index_1 = __importDefault(require("./routes/index"));
app.use('/', index_1.default);
module.exports = app;
