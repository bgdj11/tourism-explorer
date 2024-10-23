import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/my-equipment.model';
import { TourExecutionService } from '../tour.execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';


@Component({
  selector: 'xp-my-equipment',
  templateUrl: './my-equipment.component.html',
  styleUrls: ['./my-equipment.component.css']
})
export class MyEquipmentComponent implements OnInit {
  equipment: Equipment[] = [];

  constructor(private service: TourExecutionService) { }

  ngOnInit(): void {
    this.getEquipment();
  }

  getEquipment(): void {
    this.service.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipment = result.results;
      },
      error: () => {
      }
    })
  }

}
