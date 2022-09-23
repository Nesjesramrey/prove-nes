import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'public-documents-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit {
  @Input('data') data: any = [];
  @Input('image') image: string = '';

  constructor() {}

  ngOnInit(): void {
  }
}

interface Testimonial {
  title: string;
  avatar: string;
  creation: string;
  image: string;
  id: string;
}

const _testimonials = [
  {
    id: 'tst_1',
    title: 'Testimonio 1',
    avatar:
      'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '01/12/2021',
    image:
      'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_5',
    title: 'Recopilación',
    avatar:
      'https://images.pexels.com/photos/634021/pexels-photo-634021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '01/02/2022',
    image:
      'https://images.pexels.com/photos/959325/pexels-photo-959325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_2',
    title: 'Testimonio 2',
    avatar:
      'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '06/02/2022',
    image:
      'https://images.pexels.com/photos/2469/building-construction-building-site-constructing.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_3',
    title: 'Recopilación',
    avatar:
      'https://images.pexels.com/photos/634021/pexels-photo-634021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '06/02/2022',
    image:
      'https://images.pexels.com/photos/2314022/pexels-photo-2314022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_7',
    title: 'Recopilación',
    avatar:
      'https://images.pexels.com/photos/634021/pexels-photo-634021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '06/02/2022',
    image:
      'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  {
    id: 'tst_1',
    title: 'Testimonio 1',
    avatar:
      'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '01/12/2021',
    image:
      'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_5',
    title: 'Recopilación',
    avatar:
      'https://images.pexels.com/photos/634021/pexels-photo-634021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '01/02/2022',
    image:
      'https://images.pexels.com/photos/959325/pexels-photo-959325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_2',
    title: 'Testimonio 2',
    avatar:
      'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '06/02/2022',
    image:
      'https://images.pexels.com/photos/2469/building-construction-building-site-constructing.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_3',
    title: 'Recopilación',
    avatar:
      'https://images.pexels.com/photos/634021/pexels-photo-634021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '06/02/2022',
    image:
      'https://images.pexels.com/photos/2314022/pexels-photo-2314022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'tst_7',
    title: 'Recopilación',
    avatar:
      'https://images.pexels.com/photos/634021/pexels-photo-634021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creation: '06/02/2022',
    image:
      'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];
