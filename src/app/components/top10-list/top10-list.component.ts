import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';

export interface Section {
  name: string;
  value: number;
}

@Component({
  selector: '.top10-list',
  templateUrl: './top10-list.component.html',
  styleUrls: ['./top10-list.component.scss'],
})
export class Top10ListComponent implements OnInit {
  folders: Section[] = [
    {
      name: 'Construir escuelas en 2 años',
      value: 88,
    },
    {
      name: 'Construir 1000km de ancho de banda',
      value: 50,
    },
    {
      name: 'Estrategia de Combate al narcotrafico',
      value: 50,
    },
    {
      name: 'Camaras con IA en transporte',
      value: 50,
    },
    {
      name: 'Transporte publico gratis para estudiantes',
      value: 50,
    },
    {
      name: 'Subsidio a la familia por educacion',
      value: 50,
    },
  ];

  constructor() { }

  ngOnInit(): void { }
}
