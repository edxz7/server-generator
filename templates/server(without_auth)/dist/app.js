#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
var express_1 = __importDefault(require("express"));
var serve_favicon_1 = __importDefault(require("serve-favicon"));
var hbs_1 = __importDefault(require("hbs"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var typeorm_1 = require("typeorm");
var index_routes_1 = __importDefault(require("./routes/index.routes"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app_name, debug, connection, app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app_name = require('../package.json').name;
                    debug = require('debug')(app_name + ":" + path_1.default.basename(__filename).split('.')[0]);
                    return [4 /*yield*/, typeorm_1.createConnection({
                            type: "postgres",
                            url: "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@localhost:5432/" + process.env.DB,
                            entities: [path_1.default.join(__dirname, './entities/**/*.{ts,js}')],
                            synchronize: true
                        })];
                case 1:
                    connection = _a.sent();
                    // display DB info
                    console.log("connected to PostgreSQL! Database options: ", connection.options);
                    app = express_1.default();
                    // Middleware Setup
                    app.use(morgan_1.default('dev'));
                    app.use(express_1.default.json());
                    app.use(express_1.default.urlencoded({ extended: false }));
                    // Express View engine setup
                    app.use(require('node-sass-middleware')({
                        src: path_1.default.join(__dirname, 'public'),
                        dest: path_1.default.join(__dirname, 'public'),
                        sourceMap: true
                    }));
                    app.set('views', path_1.default.join(__dirname, 'views'));
                    app.set('view engine', 'hbs');
                    hbs_1.default.registerPartials(path_1.default.join(__dirname, 'views/partials'));
                    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
                    app.use(serve_favicon_1.default(path_1.default.join(__dirname, 'public', 'images', 'favicon.ico')));
                    // default value for title local
                    app.locals.title = 'Express - Generated with kavak typescript generator';
                    app.use('/', index_routes_1.default);
                    return [2 /*return*/, app];
            }
        });
    });
}
module.exports = bootstrap;
