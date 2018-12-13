import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components';

const componentList = [
  SpinnerComponent,
]

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule
  ],
  exports: componentList,
})

export class OfficeUiFabricModule { }
