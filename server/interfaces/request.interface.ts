import { User } from 'server/models/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    jwtPayload?: any;
    user: User;
  }
}
