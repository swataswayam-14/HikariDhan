import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user";
import {ApiError} from "../utils/errors";
import { validateEmail, validatePassword } from "../utils/validators";

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, username } = req.body;
      
      if (!validateEmail(email)) {
        throw new ApiError(400, 'Invalid email format');
      }

      if (!validatePassword(password)) {
        throw new ApiError(400, 'Invalid password format');
      }

      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        throw new ApiError(400, 'Email or username already exists');
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        email,
        username,
        password: hashedPassword,
        wallets: {}
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new ApiError(401, 'Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          wallets: user.wallets,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { username } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      if (username) {
        const existingUsername = await User.findOne({ 
          username,
          _id: { $ne: user._id }
        });
        
        if (existingUsername) {
          throw new ApiError(400, 'Username already taken');
        }
        user.username = username;
      }

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.userId).select('+password');
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect');
      }

      if (!validatePassword(newPassword)) {
        throw new ApiError(400, 'Invalid new password format');
      }

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();