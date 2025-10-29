import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenModel } from '../database/src/models';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly accessTokenModel: AccessTokenModel,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const accessToken = await this.accessTokenModel.findOne({
        accessToken: token,
      });

      if (!accessToken) throw new UnauthorizedException('Invalid token'); // Check if token exists in the database

      request.user = decoded; // Attach user info to request
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
