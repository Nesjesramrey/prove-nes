import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EndPointService } from './endpoint.service';

@Injectable()
export class UtilityService {
  public emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public numberOnly: string = '^[0-9]*$';
  public image_extensions: any = ['jpg', 'jpeg', 'png', 'bmp'];

  constructor(
    public snackbar: MatSnackBar,
    public router: Router,
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  emailDomainValidator(control: FormControl) {
    let email = control.value;
    if (email && email.indexOf('@') != -1) {
      let [_, domain] = email.split('@');
      if (domain === "") {
        return {
          emailDomain: {
            parsedDomain: domain
          }
        }
      }
    }
    return null;
  }

  openSuccessSnackBar(message: string) {
    this.snackbar.open(message, 'x', {
      duration: 7000,
      panelClass: ['blue-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end'
    });
  }

  openErrorSnackBar(message: string) {
    this.snackbar.open(message, 'x', {
      duration: 7000,
      panelClass: ['red-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end'
    });
  }

  linkMe(url: string) {
    this.router.navigateByUrl(url);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  fetchAllStates() {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllStatesEndPoint, {});
  }

  fetchAllStatesMex() {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllStatesMexEndPoint, {});
  }

  createNewCategory(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewCategoryEndPoint, data);
  }

  fetchAllCategories() {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllCategoriesEndPoint, {});
  }

  fetchAllActivities() {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllActivitiesEndPoint, {});
  }

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    };
    return new Blob([ia], { type: mimeString });
  }

  formatDocumentBreadscrumbs(reply:any){
    const arrayTitle = reply[0].title.split(' ');
    reply[0].title = ( arrayTitle.length <= 3 ) 
    ? reply[0].title
    : `... / ${arrayTitle[0]} ${arrayTitle[1]} ${arrayTitle[2]}`;
    return reply[0];
  }

  formatCategoryBreadscrumbs(reply:any){
    const arrayTitleCategory = reply[1].category.name.split(' ');
    reply[1].category.name = ( arrayTitleCategory.length <= 3 ) 
    ? reply[1].category.name
    : `... / ${arrayTitleCategory[0]} ${arrayTitleCategory[1]} ${arrayTitleCategory[2]}`;
    return reply[1];
  }

  formatSubCategoryBreadscrumbs(reply:any){
    const arrayTitleCategory = reply[2].category.name.split(' ');
    reply[2].category.name = ( arrayTitleCategory.length <= 3 ) 
    ? reply[2].category.name
    : `... / ${arrayTitleCategory[0]} ${arrayTitleCategory[1]} ${arrayTitleCategory[2]}`;
    return reply[2];
  }

  formatTopicBreadscrumbs(reply:any){
    const arrayTitleCategory = reply[3].category.name.split(' ');
    reply[3].category.name = ( arrayTitleCategory.length <= 3 ) 
    ? reply[3].category.name
    : `... / ${arrayTitleCategory[0]} ${arrayTitleCategory[1]} ${arrayTitleCategory[2]}`;
    return reply[3];
  }
}
