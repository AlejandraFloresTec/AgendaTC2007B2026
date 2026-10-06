import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { ContactResponseDto } from './dto/contact-response.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly repository: ContactsRepository) { }

  async create(data: any): Promise<ContactResponseDto> {
    const contact = await this.repository.save({
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
    });
    return ContactResponseDto.fromEntity(contact);
  }

  async findAll(): Promise<ContactResponseDto[]> {
    const contacts = await this.repository.findAll();
    return contacts.map((c) => ContactResponseDto.fromEntity(c));
  }

  async findOne(id: string): Promise<ContactResponseDto> {
    const contact = (await this.repository.findAll()).find((c) => c.id == id);
    if (!contact) {
      throw new NotFoundException('Contacto ' + id + ' no encontrado');
    }
    return ContactResponseDto.fromEntity(contact);
  }

  async update(
    id: string,
    changes: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const contact = (await this.repository.findAll()).find((c) => c.id == id);
    if (!contact) {
      throw new NotFoundException('Contacto ' + id + ' no encontrado');
    }
    const updated = (await this.repository.update(id, changes))!;
    return ContactResponseDto.fromEntity(updated);
  }

  async remove(id: string): Promise<void> {
    const contact = (await this.repository.findAll()).find((c) => c.id == id);
    if (!contact) {
      throw new NotFoundException('Contacto ' + id + ' no encontrado');
    }
    await this.repository.delete(id);
  }
}
