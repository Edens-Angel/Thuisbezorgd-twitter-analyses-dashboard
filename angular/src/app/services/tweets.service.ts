import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Observable, of} from 'rxjs';
import {environment as env} from "../../environments/environment";
import {AllTweetsItem} from '../all-tweets/all-tweets.component';


@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  private SERVER_URL = env.apiUrl;

  orderedTweetsArray: any = new Array();
  tweetLimit: number = 5;
  dataSource!: MatTableDataSource<any>;
  tweetDates: string[] = [];
  amountOfTweets: number[] = [];
  public sentiment_obj: any = {
    neutral_array: [], negative_array: [], positive_array: []
  };


  constructor(private httpClient: HttpClient) {
    this.dataSource = new MatTableDataSource<any>();
  }

  allTweets(filter?: string): Observable<AllTweetsItem[]> {
    let params = new HttpParams();

    if (filter) {
      params = params.set('f', filter);
    }

    return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/tweet`, {params});
  }

  groupedTweets(periodFilter?: string, dateFilter?: string) {
    let params = new HttpParams();

    if (dateFilter) {
      params = params.set('date', dateFilter);
    }

    if (periodFilter) {
      params = params.set('f', periodFilter);
    }

    return this.httpClient.get(`${this.SERVER_URL}/tweet/subject-count`, {params});
  }

  users(periodFilter?: string, dateFilter?: string) {
    let params = new HttpParams();

    if (dateFilter) {
      params = params.set('date', dateFilter);
    }

    if (periodFilter) {
      params = params.set('f', periodFilter);
    }

    return this.httpClient.get(`${this.SERVER_URL}/agg-numbers-graph`, {params});
  }

  dateFilteredTweets(startDate = '*', endDate = '*'): Observable<AllTweetsItem[]> {
    let params = new HttpParams()
      .set('s', startDate).set('e', endDate);

    return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/tweet/date`, {params});
  }

  getSentimentCount() {
    return this.httpClient.get(`${this.SERVER_URL}/tweet/sentiment`);
  }

  unique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }
}
