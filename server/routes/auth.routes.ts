import express from 'express';
import { handleLogin, checkToken } from 'server/controller/auth.controller';

export const authRoutes = express.Router();

authRoutes.post('/login', handleLogin);
authRoutes.get('/checkAuth', checkToken);
