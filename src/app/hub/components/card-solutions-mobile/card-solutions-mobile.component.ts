import { Component, OnInit } from '@angular/core';
import { SolutionService } from 'src/app/services/solution.service';



@Component({
  selector: 'card-solutions-mobile',
  templateUrl: './card-solutions-mobile.component.html',
  styleUrls: ['./card-solutions-mobile.component.scss']
})
export class CardSolutionsMobileComponent implements OnInit {
  public solutions: any=null;
  public isDataAvailable: boolean = false;

  constructor(
    public solutionService: SolutionService,) 
   { }

  ngOnInit(): void {
    this.solutionService.fetchTopSolution().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.solutions = reply;
        //console.log(this.solutions);
      },
      complete: () => {
        this.isDataAvailable = true;
      },
    })
  }

}
