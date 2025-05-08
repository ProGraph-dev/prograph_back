import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, updateProjectDto } from './dto/project.dto';
import { FastifyReply } from 'fastify';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { CurrentUserInteface } from 'src/utils/interface/current-user.interface';
import { UserRoleEnum } from 'src/utils/enums/user-role.enum';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';
import { ProjectStatusEnum } from './enum/project-status.enum';

@Controller('project')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  @Post('/create')
  private async create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user,
    @Res() reply: FastifyReply,
  ) {
    try {
      dto.customer = { id: user.id };
      const createRes = await this._projectService.save(dto);
      if (createRes.statusCode == HttpStatus.CREATED) {
        return reply.status(HttpStatus.CREATED).send(createRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('update')
  private async update(
    @Body() dto: updateProjectDto,
    @CurrentUser() user: CurrentUserInteface,
    @Res() reply: FastifyReply,
  ) {
    try {
      const checkRes = await this._projectService.CheckPidAndCid({
        project_id: dto.id,
        customer_id: user.id,
      });
      if (!checkRes.project_exist) {
        throw new HttpException('Project is not found', HttpStatus.NOT_FOUND);
      }
      if (!checkRes.is_customer || user.userRole <= UserRoleEnum.SUPPORT) {
        throw new HttpException(
          'you dont have permision for this request',
          HttpStatus.FORBIDDEN,
        );
      }
      const updateRes = await this._projectService.update(dto);
      if (updateRes.statusCode == HttpStatus.OK) {
        return reply.status(updateRes.statusCode).send(updateRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('by-id/:id')
  private async getById(@Param('id') id, @Res() reply: FastifyReply) {
    try {
      const getRes = await this._projectService.getById(+id);
      if (getRes.statusCode == HttpStatus.OK) {
        return reply.status(getRes.statusCode).send(getRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('many')
  @UseGuards(IsAdminGuard)
  private async getMany(
    @Query()
    { skip, take, title }: { skip: number; take: number; title?: string },
    @Res() reply: FastifyReply,
  ) {
    try {
      title = title == '' ? null : title;
      const getRes = await this._projectService.getMany(+skip, +take, title);
      if (getRes.statusCode == HttpStatus.OK) {
        return reply.status(getRes.statusCode).send(getRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('many/by-customer/:customer_id')
  @UseGuards(IsAdminGuard)
  private async getManyByCustomerId(
    @Param('customer_id') customer_id,
    @Query()
    { skip, take, title }: { skip: number; take: number; title?: string },
    @Res() reply: FastifyReply,
  ) {
    try {
      title = title == '' ? null : title;
      const getRes = await this._projectService.getManyByCustomerId(
        +customer_id,
        +skip,
        +take,
        title,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return reply.status(getRes.statusCode).send(getRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('many/my')
  private async getMyMany(
    @CurrentUser() user: CurrentUserInteface,
    @Query()
    { skip, take, title }: { skip: number; take: number; title?: string },
    @Res() reply: FastifyReply,
  ) {
    try {
      title = title == '' ? null : title;
      const getRes = await this._projectService.getManyByCustomerId(
        user.id,
        +skip,
        +take,
        title,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return reply.status(getRes.statusCode).send(getRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/soft/:id')
  @UseGuards(IsAdminGuard)
  private async deleteSoft(@Param('id') id, @Res() reply: FastifyReply) {
    try {
      const delRes = await this._projectService.update({
        id: +id,
        status: ProjectStatusEnum.DELETED,
      });
      if (delRes.statusCode == HttpStatus.OK) {
        return reply
          .status(HttpStatus.NO_CONTENT)
          .send({ message: 'Data successfully deleted' });
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/hard/:id')
  @UseGuards(IsAdminGuard)
  private async deleteHard(@Param('id') id, @Res() reply: FastifyReply) {
    try {
      const delRes = await this._projectService.delete(+id);
      if (delRes.statusCode == HttpStatus.NO_CONTENT) {
        return reply
          .status(delRes.statusCode)
          .send({ message: delRes.message });
      }
    } catch (err) {
      throw err;
    }
  }
}
