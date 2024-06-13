import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UserService } from '../user/user.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('employee')
export class EmployeeController {
  constructor(
    private _employeeService: EmployeeService,
    private _userService: UserService,
  ) {}

  @Post('/create')
  @UseGuards(IsAdminGuard)
  private async createEmployee(@Body() { description, photo, userId, ISO }) {
    try {
      const getRes = await this._userService.getUserById({ id: userId });
      if (getRes.statusCode == HttpStatus.OK) {
        const user = getRes.response;
        const saveRes = await this._employeeService.save({
          description,
          photo,
          user,
          ISO,
        });
        if (saveRes.statusCode == HttpStatus.CREATED) {
          return saveRes;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/all')
  private async getEmployeeList(@Query() { skip, take }) {
    try {
      const getRes = await this._employeeService.getList(skip, take);
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  private async getById(@Param('id') id) {
    try {
      const getRes = await this._employeeService.getById({ id });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('/update/:id')
  private async updateEmployee(
    @Body() { description, photo, ISO },
    @Param('id') id,
  ) {
    try {
      const updateRes = await this._employeeService.update({
        id,
        description,
        photo,
        ISO,
      });
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
