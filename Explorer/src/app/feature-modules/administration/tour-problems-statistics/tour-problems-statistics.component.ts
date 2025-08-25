import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthorStatsDto } from '../model/author-stats-dto.model';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-problems-statistics',
  templateUrl: './tour-problems-statistics.component.html',
  styleUrls: ['./tour-problems-statistics.component.css']
})

export class TourProblemsStatisticsComponent implements OnInit {
  chartsOptions: any[] = []; 

  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
  this.service.getAuthorStats().subscribe((data: AuthorStatsDto[]) => {
    const charts: any[] = [];

    data.forEach(author => {
      this.service.getUser(author.authorId).subscribe(
        (user) => {
          charts.push({
            tooltip: { trigger: 'item' },
            legend: { top: '5%', left: 'center' },
            title: { text: `Author: ${user.username}`, left: 'center' },
            series: [
              {
                name: `Author: ${user.username}`,
                type: 'pie',
                radius: '50%',
                data: [
                  { name: 'Resolved', value: author.resolvedPercentage },
                  { name: 'Closed', value: author.closedPercentage },
                  { name: 'Unresolved', value: author.unresolvedPercentage }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          });

          this.chartsOptions = [...charts];
        },
        (error) => console.error(`Error fetching username for authorId ${author.authorId}:`, error)
      );
    });
  });
}


}
