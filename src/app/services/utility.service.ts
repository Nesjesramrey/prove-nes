import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EndPointService } from './endpoint.service';

@Injectable()
export class UtilityService {
  public emailPattern: any =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public numberOnly: string = '^[0-9]*$';
  public image_extensions: any = ['jpg', 'jpeg', 'png', 'bmp'];
  public errorOops: string = '¡Oops!... Ocurrió un error, inténtalo más tarde.';
  public editedSuccess: string = 'Se actualizó correctamente.';
  public saveSuccess: string = 'Se guardo correctamente.';
  public userAddedSuccesss: string = 'El usuario se agrego correctamente.';
  public actionControlActivityList: any = ['administrator', 'editor'];
  public emailSendSuccess: string = 'El correo electrónico se envió correctamente.'

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
      if (domain === '') {
        return {
          emailDomain: {
            parsedDomain: domain,
          },
        };
      }
    }
    return null;
  }

  openSuccessSnackBar(message: string) {
    this.snackbar.open(message, 'x', {
      duration: 7000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  openErrorSnackBar(message: string) {
    this.snackbar.open(message, 'x', {
      duration: 7000,
      panelClass: ['red-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  linkMe(url: string) {
    this.router.navigateByUrl(url);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  fetchAllStates() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllStatesEndPoint, {}
    );
  }

  fetchAllStatesMex() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllStatesMexEndPoint, {}
    );
  }

  createNewCategory(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewCategoryEndPoint, data
    );
  }

  fetchAllCategories() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllCategoriesEndPoint, {}
    );
  }

  fetchAllActivities() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllActivitiesEndPoint, {}
    );
  }

  fetchAssociationTypology() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAssociationTypologyEndPoint, {}
    );
  }

  searchCollege(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.searchCollegeEndPoint + `?filter=${data['filter']}&state=${data['state']}`, {}
    );
  }

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  formatBreadscrumbs(arrayTitles: any) {
    let resultTitle = [];
    for (let title of arrayTitles) {
      if (title.length > 0) {
        const arrayTitle = title.split(' ');
        title = arrayTitle.length <= 4 ? title : `${arrayTitle[0]} ${arrayTitle[1]} ${arrayTitle[2]} ${arrayTitle[3]}...`;
        resultTitle.push(title);
      }
    }
    return resultTitle;
  }

  formatTitles(
    document: string,
    category: string,
    subCategory: string,
    topic: string
  ) {
    const array = [document, category, subCategory, topic];
    return this.formatBreadscrumbs(array);
  }

  inviteUserToMexicolectivo(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.inviteUserToMexicolectivoEndPoint, data
    );
  }

  shareLinkByEmail(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.shareLinkByEmailEndPoint, data
    );
  }

  truncateHTML(text: string): string {
    let charlimit = 140;
    if (!text || text.length <= charlimit) { return text; }
    let adding_spaces = text.replace(/<br \/>/g, "&nbsp;");
    let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
    let shortened = without_html.substring(0, charlimit) + "...";
    return shortened;
  }

  truncateMessages(text: string): string {
    let charlimit = 170;
    if (!text || text.length <= charlimit) { return text; }
    let adding_spaces = text.replace(/<br \/>/g, "&nbsp;");
    let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
    let shortened = without_html.substring(0, charlimit) + "..";
    return shortened;
  }
}
