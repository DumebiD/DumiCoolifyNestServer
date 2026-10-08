import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! said Dum';
  }
  getCreator(): string {
    return 'Dum created this';
  }
}
