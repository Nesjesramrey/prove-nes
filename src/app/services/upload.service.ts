import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UploadService {
  public uploadSubject = new Subject<any>();

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  injectPayload(obj: any) {
    this.uploadSubject.next(obj);
  }

  getPayload(): Observable<any> {
    return this.uploadSubject.asObservable();
  }

  uploadUserAvatar(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.uploadUserAvatarEndPoint, data);
  }
}
