import { PartialType } from '@nestjs/mapped-types';
import { CreateRezerveDto } from './create-rezerve.dto';

export class UpdateRezerveDto extends PartialType(CreateRezerveDto) {}
