import { Response } from "express";
import validationResult from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/User";
import {IRequestWithUser, IUser} from "../types";

// @route   GET api/auth
// @desc    Get user data expect password
// @access  Private
const getAllUserData = async (req: IRequestWithUser, res: Response): Promise<Partial<IUser>> => {
  try {
      //as in authScreen.ts middleware req.user has the value of user id
      const user = await User.findById(req.user.id).select('-password')
      await res.json(user);
  } catch(error) {
      console.error(error.message);
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
const login = async (req: IRequestWithUser & { body: LoginRequest }, res: Response): Promise<Partial<IUser>> => {
    const errors = validationResult(req);   //Checking for validation errors
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if(!user) return res.status(422).json({ error:  'Invalid Credentials' }); //User not exits with given email
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) return res.status(422).json({ error: 'Invalid Credentials' });

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
          payload,
          process.env.JWTSCERET,
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
