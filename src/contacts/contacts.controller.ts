import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactResponseDto } from './dto/contact-response.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import type { JWTPayload } from 'src/auth/jwt';
import { CurrentUser } from 'src/auth/current_user.decorator';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly service: ContactsService) { }

  @Post()
  create(@Body() dto: CreateContactDto): Promise<ContactResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  // eslint-disable-next-line prettier/prettier
  findAll(
    @CurrentUser() user: JWTPayload,
  ): Promise<ContactResponseDto[]> {
    console.log(user.email);
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ContactResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
