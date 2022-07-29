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

  putSupportNotification(object: any) {
    this.socket.emit('new_supportNotification', object);
  }

  getSupportNotification() {
    return this.socket.fromEvent('new_supportNotification').pipe(map(object => object));
  }

  putSupportConversationMessage(object: any) {
    this.socket.emit('new_supportMessage', object);
  }

  getSupportConversationMessage() {
    return this.socket.fromEvent('new_supportMessage').pipe(map(object => object));
  }
}
