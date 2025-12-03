import { Injectable } from '@nestjs/common'
import { WebscoketGateway } from './webscoket.gateway'

@Injectable()
export class WebscoketService {
  constructor(private readonly websocketGateway: WebscoketGateway) {}
  test() {
    this.websocketGateway.postMessage('webscoketServer', '111')
  }
}
