import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ObjectDTO } from '../model/object.model';
import { ObjectService } from '../object.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {faPencil, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import { Router } from '@angular/router';



@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit{
  objects: ObjectDTO[] = [];
  selectedObject: any = null;
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  modalTitle: string = '';
  object: ObjectDTO = {
    id: 0,
    name: '',
    description: '',
    image: '',
    category: ''
  };

  @ViewChild('objectModal') objectModal!: TemplateRef<any>;
  private modalRef!: NgbModalRef;

  constructor(
    private objectService: ObjectService,
    private modalService: NgbModal,
    private router: Router // Inject Router
  ) {
    //this.loadAvailableEquipment();
  }

  selectObject(object: any): void {
    this.selectedObject = object;
  }

  ngOnInit(): void {
    this.loadObjects();
  }

  loadObjects(): void {
    this.objectService.getObjects(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.objects = data.results;
        this.totalCount = data.totalCount;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja objekata', error);
      }
    );
  }

  openModal(mode: string, object?: ObjectDTO): void {
    this.modalTitle = mode === 'add' ? 'Dodaj novi objekat' : 'Izmeni objekat';
    this.object = object
      ? { ...object }
      : {
        id: 0,
        name: '',
        description: '',
        image: '',
        category: ''
      };
    this.modalRef = this.modalService.open(this.objectModal);
  }

  closeModal(): void {
    this.modalRef.close();
  }

  onSubmit(): void {
    this.object = {
      ...this.object
    }
    if (this.object.id) {
      this.objectService.updateObject(this.object).subscribe(
        (response) => {
          this.loadObjects();
          this.closeModal();
        },
        (error) => {
          console.error('Greška prilikom izmenjivanja objekta', error);
        }
      );
    } else {
      this.objectService.createObject(this.object).subscribe(
        (response) => {
          this.loadObjects();
          this.closeModal();
        },
        (error) => {
          console.error('Greška prilikom dodavanja objekta', error);
        }
      );
    }
  }


  deleteObject(objectId: number): void {
    if (confirm('Da li ste sigurni da zelite da obrišete ovu turu?')) {
      this.objectService.deleteObject(objectId).subscribe(
        (response) => {
          this.loadObjects();
        },
        (error) => {
          console.error('Greška prilikom brisanja objekta', error);
        }
      );
    }
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.loadObjects();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadObjects();
    }

  }

  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;
  protected readonly faPlus = faPlus;
}
