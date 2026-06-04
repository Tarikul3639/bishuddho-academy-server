import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService], // Inject ConfigService to access environment variables
            imports: [ConfigModule], // Import ConfigModule to access environment variables
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'), // Use the MONGO_URI from environment variables
                onConnectionCreate: (connection) => {
                    console.log('✅ MongoDB connection established');
                    connection.on('error', (err) => {
                        console.error('❌ MongoDB connection error:', err);
                    });
                },
            }),
        }),
    ],
})
export class DatabaseModule { }