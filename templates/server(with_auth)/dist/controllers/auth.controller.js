"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.postLogin = exports.getLogin = exports.postSignup = exports.getSignup = void 0;
var User_entity_1 = require("../entities/User.entity");
var typeorm_1 = require("typeorm");
var passport_config_1 = __importDefault(require("../config/passport.config"));
var bcrypt_1 = __importDefault(require("bcrypt"));
//SIGNUP 
exports.getSignup = function (req, res, next) {
    res.render('auth/signup');
};
exports.postSignup = function (req, res, next) {
    req.session.destroy(function () {
        req.logOut();
        res.clearCookie('graphNodeCookie');
    });
    var _a = req.body, email = _a.email, username = _a.username, password = _a.password;
    if (email === '' || password === '') {
        res.render("auth/signup", { message: "The email and password are required" });
    }
    typeorm_1.getRepository(User_entity_1.User).findOne({ email: email }).then(function (user) {
        if (!user) {
            var salt = bcrypt_1.default.genSaltSync(10);
            var hashPassword = bcrypt_1.default.hashSync(password, salt);
            var newUser = typeorm_1.getRepository(User_entity_1.User).create({ email: email, username: username, password: hashPassword });
            typeorm_1.getRepository(User_entity_1.User)
                .save(newUser)
                .then(function () { return res.redirect('/'); })
                .catch(function (err) { return console.log(err); });
        }
        else {
            res.render('auth/signup', { message: "This email is in use" });
        }
    }).catch(function (err) { return console.log(err); });
};
//LOGIN
exports.getLogin = function (req, res, next) {
    var message = req.flash("error")[0];
    res.render('auth/login', { message: message });
};
exports.postLogin = passport_config_1.default.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
});
//LOGOUT
exports.logout = function (req, res, next) {
    req.session.destroy(function () {
        req.logOut();
        res.clearCookie('graphNodeCookie');
        res.status(200);
        res.redirect('/login');
    });
};
