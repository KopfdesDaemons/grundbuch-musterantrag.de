import { JwtPayload } from 'jsonwebtoken';
import { User } from 'common/models/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    jwtPayload?: JwtPayload;
    user?: User;
  }
}
