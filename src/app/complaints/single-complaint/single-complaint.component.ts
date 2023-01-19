import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ComplaintService } from 'src/app/services/complaint.service';

@Component({
  selector: '.single-complaint',
  templateUrl: './single-complaint.component.html',
  styleUrls: ['./single-complaint.component.scss']
})
export class SingleComplaintComponent implements OnInit {
  public complaintID: string = '';
  public isDataAvailable: boolean = false;
  public complaint: any = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public complaintService: ComplaintService
  ) {
    this.complaintID = this.activatedRoute['snapshot']['params']['complaintID'];
    // console.log(this.complaintID);
  }

  ngOnInit(): void {
    let complaint: Observable<any> = this.complaintService.fetchComplaintById({ complaintID: this.complaintID });
    forkJoin([complaint]).subscribe((reply: any) => {
      // console.log(reply);
      this.complaint = reply[0];
      console.log(this.complaint);

      setTimeout(() => {
        this.isDataAvailable = true;
      });
    });
  }
}
