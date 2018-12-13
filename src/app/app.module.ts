import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  CommonModule,
  Location,
  LocationStrategy,
  HashLocationStrategy,
} from '@angular/common';

import 'hammerjs';

import { HomeRepositoryComponent } from './pages/home-repository/home-repository.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthModule } from './auth/auth.module';
import { RepositoryService } from './service/repository.service';
import { TruncatePipe } from './utils/truncate.pipe';
import { MatTooltipModule } from '@angular/material';
import { OfficeUiFabricModule } from './office-ui-fabric/office-ui-fabric.module'; 

@NgModule({
  declarations: [
    AppComponent,
    HomeRepositoryComponent,
    NotFoundComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    MatTreeModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    OfficeUiFabricModule,
    BrowserModule,
    HttpClientModule,
    AuthModule,
    AppRoutingModule,
  ],
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    RepositoryService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
