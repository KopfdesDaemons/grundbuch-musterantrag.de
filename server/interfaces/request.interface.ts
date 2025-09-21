import { JwtPayload } from 'jsonwebtoken';
import { User } from 'server/models/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    jwtPayload?: JwtPayload;
    user?: User;
  }
}
