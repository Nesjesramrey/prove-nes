import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-document-theme',
  templateUrl: './add-document-theme.component.html',
  styleUrls: ['./add-document-theme.component.scss'],
})
export class AddDocumentThemeComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public imageUrl!: string;
  public addThemeFormGroup!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.addThemeFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', []],
      solution: ['', []],
      image: ['', []],
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const file = (event.target as HTMLInputElement)?.files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onCreateTopic(form: FormGroup) { }
}
