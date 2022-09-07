import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: '.solution-page',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss'],
})
export class SolutionComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public themeID: string = '';
  public document: any = null;

  public testimonials: any = TESTIMONIALS;

  constructor(public activatedRoute: ActivatedRoute) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.themeID = this.activatedRoute['snapshot']['params']['themeID'];
  }

  ngOnInit(): void {}
}

export interface ITestimony {
  title: string;
  description: string;
  created: string;
  avatarUrl: string;
  avatarUser: string;
}

const TESTIMONIALS: ITestimony[] = [
  {
    title: 'Testimonio 1',
    description: 'description',
    created: '01/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 2',
    description: 'description',
    created: '23/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 3',
    description: 'description',
    created: '10/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 4',
    description: 'description',
    created: '08/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 5',
    description: 'description',
    created: '05/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 6',
    description: 'description',
    created: '21/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 7',
    description: 'description',
    created: '22/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 8',
    description: 'description',
    created: '04/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 9',
    description: 'description',
    created: '01/03/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
];
