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

  createNewPermission(data : any) {
    const {description ,  Authorization , documentID } = data ;
    const body = {
      description : description
    }
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewPermissionEndPoint + `${documentID}` , 
    body , {
      headers:{
        Authorization
      }
    }).pipe(
      map( (data : any) => {
            console.log(data);
            return data.payload;
      }),
      catchError( (error:any) => {
        return throwError(() => { console.log("error controlado",error)})
      })
    )
  }


}
