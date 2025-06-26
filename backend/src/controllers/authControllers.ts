import { Response } from "express";
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/User";
import {IExpressRequestWithUser} from "../types";

// @route   GET api/auth
// @desc    Get user data expect password
// @access  Private
const getAllUserData = async (req: IExpressRequestWithUser, res: Response): Promise<void> => {
  try {
      //as in authScreen.ts middleware req.user has the value of user id
      const user = await User.findById(req?.user?.id).select('-password')
      res.json(user);
  } catch(error) {
      console.error(error);
      res.status(500).json({'error': 'Server Error'});
  }
}

interface LoginRequest {
    email: string;
    password: string;
}

// @route  POST api/auth
// @desc   Authenticate / login user & get token
// @access Public
const login = async (req: IExpressRequestWithUser & { body: LoginRequest }, res: Response): Promise<void> => {
    const errors = validationResult(req);   //Checking for validation errors
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if(!user) {
          res.status(422).json({ error:  'Invalid Credentials' });
          return;
      } //User not exits with given email
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
          res.status(422).json({ error: 'Invalid Credentials' });
          return;
      }

      const Jwt_secret = process.env.JWTSECRET || '';
      if (!Jwt_secret) {
        console.error('❌ JWT_SECRET environment variable is not defined');
        res.status(500).json({ error: 'Server Error' });
        return;
      }

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
          payload,
          Jwt_secret,
          { expiresIn: 360000 },
          (error, token) => {
            if(error) throw error;
            res.json({ token });
          }
      );
    } catch (error) {
      console.error(error)
      res.status(500).send('Server Error');
    }
}


export {
    getAllUserData,
    login as authenticateOrLogin
}
