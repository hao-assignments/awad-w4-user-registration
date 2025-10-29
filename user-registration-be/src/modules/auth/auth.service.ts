import { AccessTokenModel, AccountModel } from '../../libs/database/src/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SignUpDto } from '../../libs/dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountModel: AccountModel,
    private readonly accessTokenModel: AccessTokenModel,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(userId: string, email: string, username: string) {
    const payload = { userId, email, username };
    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async registerUser(data: SignUpDto) {
    try {
      const user = await this.accountModel.findOne({ email: data.email });
      if (user) {
        throw new HttpException(
          'The email is already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
      const username = await this.accountModel.findOne({
        username: data.username,
      });
      if (username) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = await this.hashPassword(data.password);
      await this.accountModel.save({
        username: data.username,
        email: data.email,
        password: hashedPassword,
      });
      return { message: 'User registered successfully' };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error registering user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await this.accountModel.findOne({ email });
      if (user) {
        if (!(await this.validatePassword(password, user.password))) {
          throw new HttpException(
            'Invalid email or password',
            HttpStatus.BAD_REQUEST,
          );
        }
        const accessToken = await this.generateToken(
          user._id as string,
          user.email,
          user.username,
        );
        await this.accessTokenModel.save({
          accessToken: accessToken,
          accountId: user._id as string,
        });
        return { accessToken, email: user.email, username: user.username };
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error logging in user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserInfo(userId: string) {
    try {
      const userInfo = await this.accountModel.findOne({ _id: userId });
      if (userInfo) {
        return userInfo;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting user info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
