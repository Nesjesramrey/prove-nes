import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, MinLengthValidator, MinValidator } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LayoutService } from 'src/app/services/layout.service';
import { PermissionService } from 'src/app/services/permission.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogErrorComponent } from 'src/app/components/dialog-error/dialog-error.component';


@Component({
  selector: 'modal-permissions',
  templateUrl: './modal-permissions.component.html',
  styleUrls: ['./modal-permissions.component.scss'],
})
export class ModalPermissionsComponent implements OnInit {
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public layout: any = [];
  public formPermission!: FormGroup;
  public isDataAvailable: boolean = false;
  public isDataAvailableLoading: boolean = false;
  public addedLayouts: any = [];
  public documentID: any;
  public descriptionLength: number = 0;
  public messageError: boolean = false;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    private permissionService: PermissionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.documentID = this.activatedRoute['snapshot'];
  }

  ngOnInit(): void {
    this.formPermission = this.formBuilder.group({
      description: ['', [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);

    this.formPermission.controls['description'].valueChanges.subscribe((valor: string) => {
      this.descriptionLength = valor.length;
    })
  }

  sendrequest() {
    if (this.formPermission.valid !== true) {
      this.messageError = true;
    }

    this.isDataAvailableLoading = true;
    const { description } = this.formPermission.value;

    const data = {
      description,
      Authorization: localStorage.getItem('accessToken'),
      documentID: this.router.url.split('/')[2]
    }

    this.permissionService.createNewPermission(data).subscribe({
      next: (data) => {
        this.isDataAvailableLoading = false;
        this.descriptionLength = 0;
        this.formPermission.controls['description'].setValue('');
      }, error: (error) => {
        this.diagloErrorOpen();
        console.log(error)
        this.isDataAvailableLoading = false;
      }
    })
  }

  killDialog() {
    this.dialogRef.close();
  }



  diagloErrorOpen() {
    const dialogRef = this.dialog.open<DialogErrorComponent>(
      DialogErrorComponent, {
      width: '550px'
    })

    dialogRef.afterClosed().subscribe((reply: any) => {
    });
  }

}
