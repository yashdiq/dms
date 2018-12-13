import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Repository } from 'src/app/model/repository';
import { RepositoryService } from 'src/app/service/repository.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentMeta } from 'src/app/model/document.meta';
import { FolderDocument } from 'src/app/model/folder.document';
import { AlertComponent } from 'src/app/auth/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-repository',
  templateUrl: './home-repository.component.html',
  styleUrls: ['./home-repository.component.css'],
})

export class HomeRepositoryComponent implements OnInit {
  isLoading: boolean = true;
  isRoot: boolean = true;
  isSaving: boolean = false;
  repository: Repository[];
  userId: string = '1';
  parentId: string = '297e501c5a4a3581015a4a36efbc0000';
  folder: FolderDocument = new FolderDocument();
  documents: DocumentMeta[];
  folderDocuments: FolderDocument[] = [];
  headerTitle: string;
  folderId: string;
  newDocument: any = null;

  @ViewChild(MatMenuTrigger)
  private menuTrigger: MatMenuTrigger;

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private repoService: RepositoryService
  ) {
    this.isRoot = this.location.isCurrentPathEqualTo('/home-repository');

    const str = this.route.snapshot.params.queryParams;
    if (str) {
      const params = JSON.parse(str);
      this.headerTitle = params.title;
      this.folderId = params.id;
    }

    //--initiate user
    const _user = localStorage.getItem("user");
    
    if (_user) {
      const user = JSON.parse(_user);
      this.userId = user.userId;
    }

    Office.initialize = (reason) => {
      console.log(reason);
    }
  }

  ngOnInit() {
    this._init();
  }

  _init(): void {
    const repo = new FolderDocument();
    repo.id = this.parentId; // example of user admin and REPOSITORY parent
    
    //--assign it to folder
    this.folder.id = this.parentId;
    
    const strUser = localStorage.getItem("user");
    const user = JSON.parse(strUser);
    
    this.userId = user.userId;

    this.route.params.subscribe(params => {
      if(params.id !== undefined) {
        repo.id = params.id;

        //--assign it to folder
        this.folder.id = params.id;
      }
      
      this.updateRepository(repo);
    });
  }

  navigate(repo: FolderDocument) {
    if (!repo.isFolder) {
      this.repoService.open(repo.id).subscribe(
        (data) => {
          console.log(data);
          if (data) {
            this.newDocument = data.binary;
          }
        },
        (err) => {
          console.log(err);
        },
        () => { //-- on completed
          if (this.newDocument != null) {
            Word.run(async (context: Word.RequestContext) => {
              let newDocument = context.application.createDocument(this.newDocument);
              
              return newDocument.open();
            });
          }
        }
      );

      return;
    }

    let id = repo.id;
    this.router.navigate(['/home-repository', id, {
      queryParams: JSON.stringify({
        id: repo.id,
        title: repo.name
      })
    }]);
  }

  openContextMenu(event: MouseEvent, repo: FolderDocument) {
    if (!repo.isFolder) return;

    event.stopPropagation();
    
    let menu = document.getElementById('menuBtn');
    menu.style.display = '';
    menu.style.position = 'absolute';
    menu.style.left = event.pageX + 5 + 'px';
    menu.style.top = event.pageY + 5 + 'px';
    
    this.folder = repo;

    this.menuTrigger.openMenu();
  }

  onMenuClosed():void {
    let menu = document.getElementById('menuBtn');
    if (menu) {
      menu.style.display = 'none';            
    }
  }

  openFolder():void {
    if (!this.folder.isFolder) return;

    let id = this.folder.id;
    this.router.navigate(['/home-repository', id , {
      queryParams: JSON.stringify({
        id: this.folder.id,
        title: this.folder.name
      })
    }]);
  }

  updateRepository(repo: FolderDocument) {
    this.repoService.getRepo(this.userId, repo.id).subscribe(
      data => {
        this.repository = data;
      },
      error => console.log("Error: ", error),
      () => {
        const type: string = "MS Word";
        this.repoService.getDocumentsByFolder(repo.id, type).subscribe(
          data => {
            this.documents = data;
          },
          error => console.log("Error: ", error),
          () => {
            this.folderDocuments = [];

            for (let repo of this.repository) {
              const fd = new FolderDocument();
              fd.id = repo.id;
              fd.isFolder = true;
              fd.name = repo.name;
              fd.type = 'Folder';
              
              this.folderDocuments.push(Object.assign({}, fd));
            }

            for (let doc of this.documents) {
              const fd = new FolderDocument();
              fd.id = doc.id;
              fd.isFolder = false;
              fd.name = doc.filename;
              fd.type = doc.fileType;
              
              this.folderDocuments.push(Object.assign({}, fd));
            }

            setTimeout(() => {
              this.isLoading = false;
            }, 100);
          }
        );
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  saveWordHere(): void {
    console.log('initialize office...');

    this.isSaving = true;

    Word.run(async (context: Word.RequestContext) => {
      let doc = context.document;
      let docProperties = context.document.properties;

      docProperties.load('author, lastAuthor, revisionNumber, title, subject, keywords, comments, category, manager, company, creationDate');
      context.load(doc, 'saved');

      await context.sync();
      
      if (doc.saved === false) {
        doc.save();
        
        await context.sync();
        console.log('Saved the document');
      } else {
        this._sendFile();
        console.log('The document has not changed since the last save.');
      }
    }).catch((err) => {
      this.isSaving = false;
      console.log("Error: ", err);
      if (err instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(err.debugInfo));
      }
    });
  }

  _sendFile(): void {
    Office.context.document.getFilePropertiesAsync(result => {
      let fileUrl = result.value.url;
      
      if (fileUrl != null) {
        Office.context.document.getFileAsync(
          Office.FileType.Compressed,
          {sliceSize: 10240},
          (result) => {
            if (result.status == Office.AsyncResultStatus.Failed) {
              this.isSaving = false;
              console.log(result);
            } else {
              const fileNames = fileUrl.split('/');
              const fileName = fileNames[fileNames.length - 1];
              
              this._getAllSlices(result.value, fileName);
            }
          }
        );
      } else {
        console.log("The file hasn't been saved yet. Save the file and try again");
      }
    });
  }

  _getAllSlices(file: any, fileName: string): void {
    let sliceCount = file.sliceCount;
    let sliceIndex = 0;
    let docdata = [];
    
    const getSlice = () => {
      file.getSliceAsync(sliceIndex, (asyncResult) => {
        if (asyncResult.status == "succeeded") {
          docdata = docdata.concat(asyncResult.value.data);
          sliceIndex++;
          if (sliceIndex == sliceCount) {
            file.closeAsync();
            
            this._sendAllSlicesData(docdata, fileName, (ok) => {
              this.isSaving = false;
              file.closeAsync();
            });

          } else {
            getSlice();
          }
        } else {
          this.isSaving = false;
          file.closeAsync();
          console.log("asyncResult)", asyncResult);
        }
      });
    }

    getSlice();
  }

  _sendAllSlicesData(docdata: any, fileName: string, callback: Function) {
    let base64File = this._encodeBase64(docdata);
    
    if (this.folderId) {
      this.folder = new FolderDocument();
      this.folder.id = this.folderId;
    }

    this.repoService.sendMultipartData(this.folder, base64File, fileName, (ok) => {
      this.isSaving = false;
      //--should reload
      if (ok) {
        this.successAlert()
      } else {
        // loader progress
      }

      callback(ok);
    });
  }

  _encodeBase64(docData) {
    var s = "";
    for (var i = 0; i < docData.length; i++)
        s += String.fromCharCode(docData[i]);
    return window.btoa(s);
  }

  errorAlert(): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {
        title: "Error Occured",
        message: "Something went wrong, document failed to save."
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })
  }

  successAlert(): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {
        title: "Success",
        message: "Document saved."
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateRepository(this.folder);
    })
  }
}


