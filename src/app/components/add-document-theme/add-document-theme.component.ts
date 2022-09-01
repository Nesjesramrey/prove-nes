import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-add-document-theme',
  templateUrl: './add-document-theme.component.html',
  styleUrls: ['./add-document-theme.component.scss'],
})
export class AddDocumentThemeComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public imageUrl!: string;
  public addThemeFormGroup!: FormGroup;
  public addSolutionFormGroup!: FormGroup;
  public showThemeForm:boolean = true;
  public showSolutionForm:boolean = false;


  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public topicService: TopicService
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.addThemeFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', []],
      //solution: ['', []],
      image: ['', []],
    });

    this.addSolutionFormGroup = this.formBuilder.group({
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

  onCreateTopic(form: FormGroup) {
    let data: any = {
      title: form['value']['title'],
      description: form['value']['description'],
      //solution: form['value']['solution'],
      layout_id: this.dialogData['categoryID']
    };
    this.topicService.createNewTopic(data).subscribe((reply: any) => {
      console.log(reply);
      //this.dialogRef.close(reply['topics']);
      this.showSolutionForm = true;
      this.showThemeForm = false;
    });
  }

  onCreateSolution(form: FormGroup) {
    let data: any = {
      title: form['value']['title'],
      description: form['value']['description'],      
      solution: form['value']['solution'],
      layout_id: this.dialogData['categoryID']
    };
    //this.topicService.createNewTopic(data).subscribe((reply: any) => {
    //  console.log(reply);
      //this.dialogRef.close(reply['topics']);
    //});
  }  
}
