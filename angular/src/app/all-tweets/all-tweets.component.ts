import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {TweetsService} from '../services/tweets.service';
import {UtilsService} from '../services/utils.service';
import {FormGroup, FormControl} from '@angular/forms';


export interface AllTweetsItem {
  created_at: string;
  user_screenname: string;
  text: string;
  trimmed_text: string;
  id: number;
  sentiment?: string;
}

@Component({
  selector: 'app-all-tweets',
  templateUrl: './all-tweets.component.html',
  styleUrls: ['./all-tweets.component.scss']
})
export class AllTweetsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AllTweetsItem>;
  filter: string = '';
  dataSource!: MatTableDataSource<AllTweetsItem>;
  spinnerLoading: boolean = false;
  req_succeeded: boolean = true;
  filterType!: string;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'trimmed_text', 'user_screenname', 'created_at'];

  campaignOne: FormGroup;

  constructor(private tweetsService: TweetsService, public utilsService: UtilsService) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<AllTweetsItem>();
    this.getAllTweetsByFilter('afgelopen week', 'w');
  }

  search(filterValue: any) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.filter = this.filter;
  }


  getDateFilteredTweets() {
    console.log(this.campaignOne.controls['start'].value);
    console.log(this.campaignOne.controls['end'].value);
    const end = this.campaignOne.controls['end'].value;
    const start = this.campaignOne.controls['start'].value;
    start.setDate(start.getDate() + 1);
    console.log(start.toISOString().slice(0, 19).replace('T', ' ') + " ");

    const stringstart = start.toISOString().slice(0, 19).replace('T', ' ') + " "
    const stringend = end.toISOString().slice(0, 19).replace('T', ' ') + " "
    var splitarray = new Array();
    splitarray = stringstart.split(" ");
    console.log(splitarray[0])

    var splitarray1 = new Array();
    splitarray1 = stringend.split(" ");
    console.log(splitarray1[0])

    this.spinnerLoading = true;

    this.tweetsService.dateFilteredTweets(start.toISOString().slice(0, 19).replace('T', ' '), end.toISOString().slice(0, 19).replace('T', ' ')).subscribe(
      data => {
        console.log(data)
        this.dataSource.data = data
        this.filterType = 'Tussen ' + splitarray[0] + ' en ' + splitarray1[0]
      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      },
      () => {
        setTimeout(() => {
          if (this.req_succeeded == false) {
            this.spinnerLoading = true
          } else {
            this.spinnerLoading = false
          }
        }, 700);
      }
    );
  }

  getAllTweetsByFilter(type: string, filter?: string): void {
    this.spinnerLoading = true;

    this.tweetsService.allTweets(filter).subscribe(
      data => {
        this.dataSource.data = data;
        this.filterType = type;
      },
      err => {
        this.req_succeeded = err.ok;
        console.error(err);
      },
      () => {
        setTimeout(() => {
          if (!this.req_succeeded) {
            this.spinnerLoading = true;
          } else {
            this.spinnerLoading = false;
          }
        }, 700);
      }
    );
  }
}
