import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    async healthCheck(): Promise<{ status: number }> {
        return { status: HttpStatus.OK };
    }
}
