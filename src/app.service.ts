import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  Test(): string {
    return 'Test';
  }
}
