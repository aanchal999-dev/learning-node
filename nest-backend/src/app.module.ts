import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, {provide: APP_GUARD, useClass: AuthGuard}],
})
export class AppModule {}
