import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>
  ) {}

  ngOnInit(): void {
    this.addThemeFormGroup = this.formBuilder.group({
      title: ['', []],
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

  onCreateCategory() {
    console.log(this.addThemeFormGroup);
  }
}
