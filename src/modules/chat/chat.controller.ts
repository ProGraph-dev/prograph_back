import { Controller, Post } from '@nestjs/common';

Controller('chat');
export class ChatController {
  constructor() {}

  @Post('create')
  private async create() {
    try {
    } catch (err) {
      throw err;
    }
  }
}
