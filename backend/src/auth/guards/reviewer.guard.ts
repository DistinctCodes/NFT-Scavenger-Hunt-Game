import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ReviewerGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw (
        err ||
        new ForbiddenException('Authentication token is missing or invalid.')
      );
    }
    // Allow access if the user is a REVIEWER or an ADMIN
    if (user.role !== UserRole.REVIEWER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }
    return user;
  }
}
