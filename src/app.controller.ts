import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AppService } from './app.service';

class EchoDto {
  @ApiProperty({ example: 'Hello' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    schema: { type: 'string', example: 'Hello World!' },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('echo')
  @ApiBody({ type: EchoDto })
  @ApiOkResponse({
    schema: { example: { message: 'Hello' } },
  })
  echo(@Body() body: EchoDto): EchoDto {
    return body;
  }
}
