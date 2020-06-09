import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User.entity';
import { getRepository } from 'typeorm';
import passport from '../config/passport.config';
import bcrypt from 'bcrypt';

//SIGNUP 
export const getSignup = (req: Request, res: Response, next: NextFunction) => {
  res.render('auth/signup')
}

export const postSignup = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(() => {
    req.logOut();
    res.clearCookie('graphNodeCookie');
  });

  const { email, username, password } = req.body;

  if(email === '' || password === ''){
    res.render("auth/signup", { message: "The email and password are required"})
  }

  getRepository(User).findOne({ email }).then(user => {
    if(!user) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt); 
      const newUser = getRepository(User).create({ email, username, password: hashPassword });
      getRepository(User)
      .save(newUser)
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
    } else {
      res.render('auth/signup', { message: "This email is in use" });
    }
  }).catch(err => console.log(err));
}

//LOGIN
export const getLogin = (req: any, res: Response, next: NextFunction) => {
  let message = req.flash("error")[0];
  res.render('auth/login' , { message })
}
export const postLogin = passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
})

//LOGOUT
export const logout = (req: any, res: Response, next: NextFunction) => {
  req.session.destroy(() => {
    req.logOut();
    res.clearCookie('graphNodeCookie');
    res.status(200);
    res.redirect('/login');
   });
}

