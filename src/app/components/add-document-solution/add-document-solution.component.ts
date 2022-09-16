import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SolutionService } from 'src/app/services/solution.service';
import { UtilityService } from 'src/app/services/utility.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-add-document-solution',
  templateUrl: './add-document-solution.component.html',
  styleUrls: ['./add-document-solution.component.scss'],
})
export class AddDocumentSolutionComponent implements OnInit {
  public imageUrl: string | null = null;
  public addSolutionFormGroup!: FormGroup;
  public submitted: boolean = false;
  public fileNames: any = [];
  public messageError : boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentSolutionComponent>,
    public dialog       : MatDialog, 
    public formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public utilityService: UtilityService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  ngOnInit(): void {
    this.addSolutionFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []],
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

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.addSolutionFormGroup.patchValue({ files: event.target.files });
    this.addSolutionFormGroup.updateValueAndValidity();
  }

  onCreateSolution(form: FormGroup) {
    try{
      this.messageError = false;
      if(this.addSolutionFormGroup.valid){
        this.submitted = true;
        let data: any = {
          topic: this.dialogData['themeID'],
          formData: new FormData()
        }
    
        Array.from(this.addSolutionFormGroup.controls['files']['value'])
          .forEach((file: any) => { data['formData'].append('files', file); });
        data['formData'].append('title', form['value']['title']);
        data['formData'].append('description', form['value']['description']);
    
        this.solutionService.createNewSolution(data).subscribe((reply: any) => {
          this.submitted = false;
          this.dialogRef.close(reply);
        });
      }else{
        this.messageError = true;
    }
  }catch(error){
       console.log(error)
       this.diagloErrorOpen(); 
    }
    
  }

  diagloErrorOpen(){
    const dialogRef = this.dialog.open<DialogErrorComponent>(
      DialogErrorComponent,{
        width:'550px'
      })

      dialogRef.afterClosed().subscribe((reply: any) => {
      });
  } 
}
