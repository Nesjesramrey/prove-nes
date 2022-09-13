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
import { PermissionService } from 'src/app/services/permission.service';
import { Router , ActivatedRoute } from '@angular/router';


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
  public isDataAvailableLoading: boolean = false;
  public addedLayouts: any = [];
  public documentID : any;
  public descriptionLength : number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityService: UtilityService,
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    private permissionService : PermissionService,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) {
    this.formPermission = this.formBuilder.group({
      description : ['', [Validators.required]]
    })

    this.documentID = this.activatedRoute['snapshot'];
  }

  ngOnInit(): void {
      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);

      this.formPermission.controls['description'].valueChanges.subscribe((valor : string) => {
             this.descriptionLength = valor.length;
             console.log(this.descriptionLength)
      })
  }

  sendrequest(){
    this.isDataAvailableLoading = true;
    const { description } = this.formPermission.value;
    const data = {
      description,
      Authorization : localStorage.getItem('accessToken'),
      documentID : this.router.url.split('/')[2]
    }
     this.permissionService.createNewPermission(data).subscribe( {next : (data) => {
      this.isDataAvailableLoading = false;
          this.descriptionLength = 0;
          this.formPermission.controls['description'].setValue('');
     } , error : (error) => {
      this.isDataAvailableLoading = false;
     }})
  }

  killDialog() {
    this.dialogRef.close();
  }

 
}
