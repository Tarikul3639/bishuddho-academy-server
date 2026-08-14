import { Module } from '@nestjs/common';

import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [CloudinaryModule, EmailModule],

  exports: [CloudinaryModule, EmailModule],
})
export class CommonModule {}
