import express from 'express';
import { handleLogin, handleRefreshToken } from 'server/controller/auth.controller';

export const authRoutes = express.Router();

authRoutes.post('/login', handleLogin);
authRoutes.get('/refresh', handleRefreshToken);
