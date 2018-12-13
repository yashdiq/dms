import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FileElement } from '../model/file-element';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { v4 } from 'uuid';

export interface ArchFileService {
  add(fileElement: FileElement);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable({
  providedIn: 'root'
})

export class FileService implements ArchFileService {
  private map = new Map<string, FileElement>();

  constructor() { }

  add(fileElement: FileElement) {
    fileElement.id = v4();
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  private querySubject: BehaviorSubject<FileElement[]>;
  
  queryInFolder(folderId: string): Observable<FileElement[]> {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string): FileElement {
    return this.map.get(id);
  }

  private clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
}
