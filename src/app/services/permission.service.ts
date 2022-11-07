import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  createNewPermission(data: any) {
    const { description, Authorization, documentID } = data;
    const body = {
      description: description
    }
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewPermissionEndPoint + `${documentID}`,
      body, {
      headers: {
        Authorization
      }
    }).pipe(
      map((data: any) => {
        return data.payload;
      }),
      catchError((error: any) => {
        return throwError(() => { console.log("error controlado", error) })
      })
    )
  }

  requestAccessPermission(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.requestAccessPermissionEndPoint, data);
  }

  markPermissionAsAttended(data: any) {
    return this.httpClient.put(this.endpointSrvc.apiEndPoint + this.endpointSrvc.markPermissionAsAttendedEndPoint + data['permission_id'] + '/mark_as_attended', data);
  }

  fetchPermissionById(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchPermissionByIdEndPoint + data['permission_id'], {});
  }
}
