import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public solutions: Solution[] = _solutions;
  public solutionsCols: string[] = ['title', 'rate'];
  public documentID: string = '';

  constructor(
    public utilityService: UtilityService,
    public activatedRoute: ActivatedRoute
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
  }

  ngOnInit(): void {}

  goToSolutionPage(solutionId: string) {
    this.utilityService.linkMe(
      `documentos-publicos/${this.documentID}/solucion/${solutionId}`
    );
  }
}

interface Solution {
  title: string;
  rate: number;
  id: string;
}

const _solutions = [
  {
    id: 'sd-1',
    title:
      'Incorporar informales a través de cuotas únicas de ISR y Seguridad Social',
    rate: 8.43,
  },
  {
    id: 'sd-2',
    title: 'Tipificar la actividad económica ilegal como delito grave',
    rate: 8.87,
  },
  { id: 'sd-3', title: 'Crear padrón de informales', rate: 6.71 },
  {
    id: 'sd-4',
    title:
      'Publicar estudio de pérdidas económicas por actividad económica informal ',
    rate: 7.49,
  },
];
