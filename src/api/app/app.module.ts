import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { PostModule } from 'src/api/post/post.module';
import { ReactionModule } from 'src/api/reaction/reaction.module';
import { AppController } from 'src/api/app/app.controller';
import { EventModule } from 'src/api/event/event.module';

@Module({
  imports: [
    InMemoryDBModule.forRoot({}),
    PostModule,
    ReactionModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
