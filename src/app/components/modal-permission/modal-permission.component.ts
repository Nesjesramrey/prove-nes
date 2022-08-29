import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
interface ModalDataType{
  description:string;
  email:string;
}
@Component({
  selector: 'app-modal-permission',
  templateUrl: './modal-permission.component.html',
  styleUrls: ['./modal-permission.component.scss']
})
export class ModalPermissionComponent implements OnInit {
  public credentials:ModalDataType = ({
    description:'',
    email:''
  });
  public formPermission:any = new FormGroup({
    description: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() { }
  ngOnInit(): void {
  }

  sendrequest(){
    this.credentials = this.formPermission.value;
  }
}
