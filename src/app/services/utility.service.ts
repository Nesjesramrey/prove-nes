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

  fetchAllStatesMex() {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllStatesMexEndPoint, {});
  }

  fetchAllCategories() {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllCategoriesEndPoint, {});
  }
}
