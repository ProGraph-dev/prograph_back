import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { DeepPartial } from 'typeorm';
import { User } from './entity/user.entity';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get('/by-id/:id')
  private async getUserById(@Param('id') id) {
    try {
      const getRes = await this._userService.getUserById({ id });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/me')
  private async getMe(@CurrentUser() user) {
    try {
      const getRes = await this._userService.getUserById({ id: user.id });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/user-list')
  private async getUserList(@Query() { skip, take }) {
    try {
      const getRes = await this._userService.getUserList(skip, take, '');
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('/update/my')
  private async updateForUser(
    @CurrentUser() user,
    @Body() { firstName, lastName, avatar }: DeepPartial<User>,
  ) {
    try {
      const updateRes = await this._userService.update(
        { id: user.id },
        { firstName, lastName, avatar },
      );
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:id')
  private async deleteUser(@Param('id') id) {
    try {
      const delRes = await this._userService.delete({ id });
      if (delRes.statusCode == HttpStatus.NO_CONTENT) {
        return delRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
