import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
    imports: [PrismaModule, CategoryModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
