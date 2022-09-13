import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'expanded-text',
  templateUrl: './expanded-text.component.html',
  styleUrls: ['./expanded-text.component.scss'],
})
export class ExpandedTextComponent implements OnInit {
  @Input() text: string = '';
  @Input() minLength: number = 200;

  public expanded: boolean = false;
  public arrayText: string[] = [];
  public isShortText: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.processText();
  }

  processText() {
    this.text = this.text || ' '
    let length = this.minLength;
    const textLength = this.text.length;

    if (this.minLength > textLength) {
      length = this.text.length / 3;
    }

    if (textLength < 200) {
      length = textLength;
      this.isShortText = true;
    }
    this.arrayText[0] = this.text.substring(0, length);
    this.arrayText[1] = this.text.substring(length, textLength);
  }

  expandBox() {
    this.expanded = !this.expanded;
  }
}
