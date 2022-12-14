import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IJwtTokenShape,
  JwtRefreshToken,
  JwtRefreshTokenDocument,
} from './jwt.schema';
import * as jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import { authConfig } from 'src/config';
import { GetUser } from './get-user.decorator';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtService {
  constructor(
    @InjectModel(JwtRefreshToken.name)
    private jwtModel: Model<JwtRefreshTokenDocument>,
  ) {}

  private generateAccessToken(jwtData: IJwtTokenShape) {
    const serializedUser = {
      username: jwtData.username,
      permissions: jwtData.permissions,
    };
    console.log('serializedUser:');
    console.log(serializedUser);
    return jwt.sign(serializedUser, process.env.ACCESS_TOKEN_SECRET as Secret, {
      expiresIn: authConfig.accessToxenExpiration,
    });
  }

  async refreshJwtToken(refreshToken_token: string) {
    if (refreshToken_token == null)
      throw new UnauthorizedException('Unauthorized');

    const existingRefreshToken = await this.jwtModel.findOne({
      token: refreshToken_token,
    });
    if (!existingRefreshToken) throw new ForbiddenException('Forbidden');
    if (existingRefreshToken.autoLogout < new Date())
      throw new UnauthorizedException('Expired refresh token');
    let newAccessToken = undefined;
    const verifyFunction = async (err: any, jwtPayload: IJwtTokenShape) => {
      if (err) {
        console.log(err);
        throw new ForbiddenException('Forbidden');
      }
      const accessToken = this.generateAccessToken(jwtPayload);
      newAccessToken = accessToken;
      return accessToken;
    };

    jwt.verify(
      refreshToken_token,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      verifyFunction,
    );
    return newAccessToken;
  }

  public async deleteJwtToken(refreshToken: string) {
    const result = await this.jwtModel.deleteOne({ refreshToken });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Token "${refreshToken}" not found`);
    }
    return HttpStatus.NO_CONTENT;
  }

  public async authenticateUserWithJwt(clientJwt: IJwtTokenShape) {
    const accessToken = this.generateAccessToken(clientJwt);
    const refreshToken = await this.jwtModel.create({
      token: jwt.sign(clientJwt, process.env.REFRESH_TOKEN_SECRET as Secret),
      autoLogout: new Date(
        new Date().getTime() + authConfig.autoLogoutPeriodMs,
      ),
    });

    //await this.jwtModel.save(refreshToken);
    return {
      accessToken,
      refreshToken: refreshToken.token,
      permissions: clientJwt.permissions,
    };
  }

  public async removeExpiredJwtRefreshTokens() {
    const result = await this.jwtModel.deleteMany({
      $or: [
        { autoLogout: { $lt: new Date() } },
        {
          autoLogout: {
            $gt: new Date(
              new Date().getTime() + authConfig.autoLogoutPeriodMs + 1000,
            ),
          },
        }, //Delete tokens, if expiration date is suspiciously too far in future
      ],
    });
    console.log(result);
  }

  public test(@GetUser() user: User, @Request() req) {
    console.log('user');
    console.log(user);
    console.log('req.body');
    console.log(req.body);
    console.log('Cross call test');
  }
}
