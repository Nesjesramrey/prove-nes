import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddDocumentThemeComponent } from 'src/app/components/add-document-theme/add-document-theme.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-modal-testimony',
  templateUrl: './modal-testimony.component.html',
  styleUrls: ['./modal-testimony.component.scss'],
})
export class ModalTestimonyComponent implements OnInit {
  public addTestimonyFormGroup!: FormGroup;
  public imageUrl: string | null = null;

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>
  ) {}

  killDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.addTestimonyFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: [''],
    });
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
}
