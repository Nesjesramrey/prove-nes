import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
 import { FormGroup , FormControl , Validators , FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LayoutService } from 'src/app/services/layout.service';


@Component({
  selector: 'modal-permissions',
  templateUrl: './modal-permissions.component.html',
  styleUrls: ['./modal-permissions.component.scss'],
})
export class ModalPermissionsComponent implements OnInit {

  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public layout: any = [];
  public formPermission : FormGroup;
  public isDataAvailable: boolean = false;
  public addedLayouts: any = [];

  constructor(
    public dialogRef: MatDialogRef<ModalPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityService: UtilityService,
    public formBuilder: FormBuilder,
    public layoutService: LayoutService
  ) {
    this.formPermission = this.formBuilder.group({
      description : ['', []],
      email       : ['', []]
    })
  }

  ngOnInit(): void {
      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
  }

  sendrequest(){
    console.log('ok')
  }

  killDialog() {
    this.dialogRef.close();
  }

 
}
