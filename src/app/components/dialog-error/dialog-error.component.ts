import { Component, OnInit , Inject } from '@angular/core';
import {MatDialog, MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})
export class DialogErrorComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<DialogErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    ) {}

    ngOnInit(): void {
      
    }

    killDialog() {
      this.dialogRef.close();
    }
    
  }

