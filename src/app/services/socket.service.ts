import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class SocketService {
  public io;

  constructor(
    public socket: Socket
  ) {
    this.io = this.socket.connect();
  }

  putNotification(object: any) {
    this.socket.emit('new_notification', object);
  }

  getNotification() {
    return this.socket.fromEvent('new_notification').pipe(map(object => object));
  }
}
