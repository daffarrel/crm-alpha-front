import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Case } from '../../../models/case';
import { CasesService } from '../../../services/cases.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: []
})
export class StatisticsComponent implements OnDestroy {
  private casesObservable: Subscription;

  // Doughnut
  public doughnutChartLabels: string[] = ['Close', 'Open'];
  public doughnutChartData: number[] = [0, 0];
  public doughnutChartType: string = 'doughnut';

  public barChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  // Chart data model
  public chartDataModel: any;

  // Bar
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          },
          gridLines: {
              display: false
          },
          stacked: true
      }],
      xAxes: [{
          gridLines: {
              display: false
          },
          display: true,
          stacked: true
      }]
    }
  };
  public barChartLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  public barChartData: any[] = [{data: []}];

  constructor(
    private caseService: CasesService
  ) {
    this.casesObservable = this.caseService.getCasesObservable().subscribe(cases => {
      this.chartDataModel = this.getChartDataModel(cases);

      this.doughnutChartData = this.chartDataModel.chartDoughnut;

      const clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = this.chartDataModel.chartBar;
      this.barChartData = clone;

    });
  }

  private getChartDataModel(cases: Case[]) {
    const numCases: number = cases.length;
    let numOpenCases: number;
    const chartDoughnut: number[] = [0, 0];
    const chartBar: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    cases.forEach(item => {
      // Doughnut chart logic
      if (item.finalizationdate) {
        chartDoughnut[0]++;
      } else {
        chartDoughnut[1]++;
      }

      // Bar chart logic
      chartBar[new Date(item.opendate).getMonth()]++;
    });

    numOpenCases = chartDoughnut[1];

    return {
      chartDoughnut,
      chartBar,
      numCases,
      numOpenCases
    };
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


  ngOnDestroy() {
    this.casesObservable.unsubscribe();
  }
}
