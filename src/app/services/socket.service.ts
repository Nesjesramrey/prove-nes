import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EndPointService } from './endpoint.service';

@Injectable()
export class SocketService {
  public io;
  public ioID: any = null;
  public socketSubject!: BehaviorSubject<any>;

  constructor(
    public socket: Socket,
    public endPointService: EndPointService,
    public httpClient: HttpClient
  ) {
    this.io = this.socket.connect();
    // console.log(this.io);
    this.socketSubject = new BehaviorSubject<any>(null);
    setTimeout(() => {
      this.ioID = this.io['id'];
      this.socketSubject.next(this.ioID);
    }, 1000);
  }

  updateSocketID(data: any) {
    return this.httpClient.put(this.endPointService.apiEndPoint + this.endPointService.updateSocketIDEndPoint + `${data['user_id']}` + '/socket', data);
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
