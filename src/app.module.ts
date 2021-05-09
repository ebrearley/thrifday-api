import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RetailersModule } from './retailers/retailers.module';
import { ProductsModule } from './products/products.module';
import { PriceMonitorModule } from './price-monitor/price-monitor.module';
import { PriceModule } from './price/price.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESS_DATABASE_HOST,
      port: parseInt(process.env.POSTGRESS_DATABASE_PORT, 10) || 5432,
      username: process.env.POSTGRESS_DATABASE_USER,
      password: process.env.POSTGRESS_DATABASE_PASSWORD,
      database: process.env.POSTGRESS_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    AuthModule,
    RetailersModule,
    ProductsModule,
    PriceMonitorModule,
    PriceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
