import express from 'express';
import { handleGetSessions, handleLogin, handleLogoutEverywhere, handleRefreshToken, handleRevokeSessions } from 'server/controller/auth.controller';
import { authMiddleware } from 'server/middleware/auth.middleware';

export const authRoutes = express.Router();

authRoutes.post('/login', handleLogin);
authRoutes.get('/refresh', handleRefreshToken);
authRoutes.delete('/logout-everywhere', authMiddleware, handleLogoutEverywhere);
authRoutes.get('/sessions', authMiddleware, handleGetSessions);
authRoutes.patch('/revoke-sessions', authMiddleware, handleRevokeSessions);
