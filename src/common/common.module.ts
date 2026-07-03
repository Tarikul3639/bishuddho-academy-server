import { Module } from "@nestjs/common";

import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
    imports: [
        CloudinaryModule,
    ],

    exports: [
        CloudinaryModule,
    ],
})
export class CommonModule {}