import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SpinnerType } from './spinner-type';

declare var fabric: any;

@Component({
  selector: 'ui-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})

export class SpinnerComponent implements OnInit, AfterViewInit {
  @Input() size: SpinnerType;
  @Input() label: string;
  isLabelShown: boolean = false;

  spinnerClasses = ['ms-Spinner'];

  constructor() { }

  ngOnInit() {
    this.spinnerClasses.push(`ms-Spinner--${this.size}`);

    if (this.label) {
      this.isLabelShown = true;
    }
  }

  ngAfterViewInit() {
    var SpinnerElements = document.querySelectorAll(".ms-Spinner");
    for (var i = 0; i < SpinnerElements.length; i++) {
      new fabric['Spinner'](SpinnerElements[i]);
    }
  }
}
