import express from 'express';
import { handleLogin, handleLogoutEverywhere, handleRefreshToken } from 'server/controller/auth.controller';
import { authMiddleware } from 'server/middleware/auth.middleware';

export const authRoutes = express.Router();

authRoutes.post('/login', handleLogin);
authRoutes.get('/refresh', handleRefreshToken);
authRoutes.delete('/logout-everywhere', authMiddleware, handleLogoutEverywhere);
