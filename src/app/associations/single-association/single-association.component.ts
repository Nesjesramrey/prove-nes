import { Component, OnInit, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { UserService } from 'src/app/services/user.service';
import { SheetFeedComponent } from 'src/app/components/sheet-feed/sheet-feed.component';

@Component({
  selector: 'single-association',
  templateUrl: './single-association.component.html',
  styleUrls: ['./single-association.component.scss']
})
export class SingleAssociationComponent implements OnInit {

  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  @Input('user') public user: any = null;
  public semblanza: any = null

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public userservices: UserService,
    public matBottomSheet: MatBottomSheet,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
   }

  

  ngOnInit(): void {
    this.userservices.fetchFireUser().subscribe({
      error: (error: any) => {
       
      },
      next: (reply: any) => {
        this.user = reply
      },
      complete: () => {
        this.isDataAvailable = true
       }
    });

    this.semblanza = "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas Letraset"

}
openBottomSheet(): void {
  const bottomSheetRef = this.matBottomSheet.open(SheetFeedComponent, {
    data: {
      user: this.user
    }
  });

  bottomSheetRef.afterDismissed().subscribe((reply: any) => {
    if (reply != undefined) { }
  });
}


}