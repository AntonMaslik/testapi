import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    async healthCheck() {
        return { status: HttpStatus.OK };
    }
}
