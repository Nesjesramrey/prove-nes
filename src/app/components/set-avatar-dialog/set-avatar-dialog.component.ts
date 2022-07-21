import { LyDialog, LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { StyleRenderer, WithStyles, lyl, ThemeRef, ThemeVariables } from '@alyle/ui';
import { LySliderChange, STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent
} from '@alyle/ui/image-cropper';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  ref.renderStyleSheet(CROPPER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);

  return {
    root: lyl`{
      ${cropper.root} {
        max-width: 100%
        height: 320px
      }
    }`,
    sliderContainer: lyl`{
      position: relative
      ${slider.root} {
        width: 100%
      }
    }`,
    slider: lyl`{
      padding: 20px 20px 0 20px
    }`
  };
};

@Component({
  selector: '.set-avatar-dialog',
  templateUrl: './set-avatar-dialog.component.html',
  styleUrls: ['./set-avatar-dialog.component.scss'],
  providers: [StyleRenderer]
})
export class SetAvatarDialogComponent implements OnInit, WithStyles, AfterViewInit {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  public ready!: boolean;
  public scale!: number;
  public minScale!: number;
  @ViewChild(LyImageCropper, { static: true }) cropper!: LyImageCropper;
  public myConfig: ImgCropperConfig = {
    width: 170,
    height: 170,
    output: {
      width: 200,
      height: 200
    },
    resizableArea: true,
    keepAspectRatio: true
  };
  public token: any = null;
  public payload: any = null;
  public user: any = null;
  public uploadFormGroup!: FormGroup;
  public uploadData: any = null;

  constructor(
    public dialogRef: LyDialogRef,
    @Inject(LY_DIALOG_DATA) private event: Event,
    readonly sRenderer: StyleRenderer,
    public authenticationSrvc: AuthenticationService,
    public userSrvc: UserService,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.event);
    this.token = this.authenticationSrvc.fetchToken;
  }

  ngOnInit(): void {
    this.payload = JSON.parse(atob(this.token.split('.')[1]));
    let user: Observable<any> = this.userSrvc.fetchUserById({ _id: this.payload['sub'] });
    forkJoin([user]).subscribe((reply: any) => {
      // console.log(reply);
      this.user = reply[0]['user'];
      // console.log(this.user);
      this.uploadFormGroup = this.formBuilder.group({
        file: ['', [Validators.required]]
      });
    });
  }

  ngAfterViewInit(): void {
    this.dialogRef.afterOpened.subscribe(() => {
      this.cropper.selectInputEvent(this.event);
    });
  }

  onCropped(event: ImgCropperEvent) {
    this.uploadFormGroup.patchValue({ 'file': event['originalDataURL'] });
  }

  onLoaded(event: ImgCropperEvent) {
    this.cropper.fitToScreen();
    setTimeout(() => { this.cropper.center(); });
  }

  onError(event: ImgCropperErrorEvent) {
    // console.log(event);
  }

  onSliderInput(event: LySliderChange) {
    this.scale = event.value as number;
  }

  onUploadAvatar() {
    this.cropper.crop();
  }
}
