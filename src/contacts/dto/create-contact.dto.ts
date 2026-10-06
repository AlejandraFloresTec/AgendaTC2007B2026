import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @IsEmail()
  email: string | undefined;

  @Matches(/^(\+?[0-9][\s-]*)+$/, { message: 'phone inválido' })
  phone: string | undefined;

  @IsOptional()
  @IsString()
  notes?: string;
}
