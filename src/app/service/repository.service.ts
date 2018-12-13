import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Repository } from '../model/repository';
import { Observable } from 'rxjs/internal/Observable';
import { DocumentMeta } from '../model/document.meta';
import { FolderDocument } from '../model/folder.document';

const _user = localStorage.getItem("user");
let token: string = null;

if (_user) {
  const user = JSON.parse(_user);
  token = user.token;
}

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'X-Auth-Token': token,
  })
};

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, {
    type: contentType,
  });

  return blob;
}

@Injectable({
  providedIn: 'root'
})

export class RepositoryService {
  constructor(private http: HttpClient) { }
  base: string = '/teknoerp/add-ins/';
  rest: string = '/teknoerp/rest/';

  getRepo(userId: string, parentId: string): Observable<Repository[]> {
    const uri = this.base + 'folders?userId=' + userId + '&parentId=' + parentId;

    return this.http.get<Repository[]>(uri, options);
  }

  getDocumentsByFolder(folderId: string, type: string): Observable<DocumentMeta[]> {
    const uri = this.base + 'documents?folderId=' + folderId + '&type=' + type;

    return this.http.get<DocumentMeta[]>(uri, options);
  }

  sendFile(folder: Repository, fileData: any, slice: any, state: any, getSlice: any, closeFile: any): any {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        console.log("Sent " + slice.size + " bytes.");
        state.counter++;

        if (state.counter < state.sliceCount) {
          getSlice(state)
        } else {
          closeFile(state)
        }
      }
    }

    let formData = new FormData();
    formData.append("file", fileData);
    formData.append("folderId", folder.id);
    formData.append("description", "Test Yashdiq");

    console.log(fileData)

    req.open("POST", this.rest + "document/upload");
    
    let boundary=Math.random().toString().substr(2);
    req.setRequestHeader("Content-Type", "multipart/form-data; charset=utf-8; boundary=" + boundary);
    req.setRequestHeader("Slice-Number", slice.index);
    req.send(formData);
  }

  sendMultipartData(folder: FolderDocument, base64File: string, fileName: string, callback: any): void {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        console.log("Done!");
        callback(true)
      } else {
        callback(false)
      }
    }

    const blob = b64toBlob(base64File, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    let formData = new FormData();
    formData.append("file", blob);
    formData.append("folderId", folder.id);
    formData.append("description", "Upload from Office 365 Online");

    let newFileName = (/[.]/.exec(fileName)) ? fileName : fileName + '.docx'

    req.open("POST", this.base + "document/upload?userId=1&fileName="+newFileName);
    req.setRequestHeader("X-Auth-Token", token);
    
    req.send(formData);
  }

  open(documentMetaId: string): any {
    const uri = this.base + 'document/open/' + documentMetaId;
    
    return this.http.get<any>(uri, options);
  }
}
