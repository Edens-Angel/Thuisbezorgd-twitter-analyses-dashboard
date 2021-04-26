import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {TweetsService} from '../services/tweets.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  req_succeeded: boolean = true;
  name: any = undefined;

  constructor(private breakpointObserver: BreakpointObserver, private tweetsService: TweetsService) {
    this.mostRecentTweets('m');

    setTimeout(() => {
      this.name = window.sessionStorage.getItem('user_name')?.replace(/['"]+/g, '');
    }, 4000);
  }

  createDate: string[] = [];
  tweetsADay: number[] = [];
  orderedTweetsArray = new Array();
  countable: number = 5;
  usedChar: string = 'm';

  ngOnInit(): void {
    // console.log(this.cards);
    this.getAllTweetsMonth();

  }

  getAllTweetsMonth() {
    this.mostRecentTweets('m');
    this.usedChar = 'm';
    this.countable = 5;

    this.createDate.length = 0;
    this.tweetsADay.length = 0;
    this.tweetsService.all_tweets('m').subscribe(
      data => {
        let counter = 0;
        for (let index = 1; index < data.length - 1; index++) {
          if (data[index - 1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7)) {
            counter = counter + 1;
            this.createDate.push(data[index].created_at.substr(5, 7));
          }
        }
        let teller = 0;
        for (let index = 0; index < this.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsADay[index] = tweetscounter;
        }
      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );
    setTimeout(() => {
      if (this.req_succeeded == false) {
      } else {
      }
    }, 7000)
  }

  getAllTweetsDay() {
    this.mostRecentTweets('d');
    this.usedChar = 'd';
    this.countable = 5;

    this.createDate.length = 0;
    this.tweetsADay.length = 0;
    this.tweetsService.all_tweets('d').subscribe(
      data => {
        console.log(data);
        let counter = 0;
        for (let index = 0; index < 1; index++) {
          counter = counter + 1;
          console.log(data[index].created_at);
          this.createDate.push(data[index].created_at.substr(5, 7));
        }
        let teller = 0;
        for (let index = 0; index < this.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsADay[index] = tweetscounter;
        }
      },
      err => {
        this.req_succeeded = err.ok
      }
    );
    setTimeout(() => {
      if (this.req_succeeded == false) {
      } else {
      }
    }, 7000)
  }

  getAllTweetsWeek() {
    this.mostRecentTweets('w');
    this.usedChar = 'w';
    this.countable = 5;

    this.createDate.length = 0;
    this.tweetsADay.length = 0;
    this.tweetsService.all_tweets('w').subscribe(
      data => {
        console.log(data);
        console.log(data[0].created_at.substr(0, 17))
        let counter = 0;
        for (let index = 1; index < data.length - 1; index++) {
          if (data[index - 1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7)) {
            counter = counter + 1;
            console.log(data[index].created_at);
            this.createDate.push(data[index].created_at.substr(5, 7));
          }
        }
        let teller = 0;
        for (let index = 0; index < this.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsADay[index] = tweetscounter;
        }
      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );

    setTimeout(() => {
      if (this.req_succeeded == false) {
      } else {
      }
    }, 7000)
  }

  /** Based on the screen size, switch from standard to one column per row */
  timeline = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      return [
        {
          title: "Timeline tweets",
          cols: 1,
          rows: 4,
          data: [
            {
              x: this.createDate,
              y: this.tweetsADay,
              type: 'bar',
              marker: {
                color: '#ff9800'
              }
            },
          ],
          layout: {width: 600, height: 400}
        }
      ];
    })
  );

  mostRecentTweets(char: string): any {
//   this.tweetsService.all_tweets(char).subscribe(
//     data => {
// let teller = 0;
//       for (let index = data.length; index > data.length - this.countable; index--) {
//         this.orderedTweetsArray[teller] = data[index-1];
//         teller = teller + 1;
//         console.log(index);
//       }
// });


    this.tweetsService.all_tweets(char).subscribe(
      data => {
        let teller = 0;
        for (let index = 0; index < this.countable; index++) {
          this.orderedTweetsArray[teller] = data[index];
          teller = teller + 1;
          console.log(index);
        }
      });
  }


  loadMoreTweetsButton() {
    this.countable = this.countable + 5;
    this.mostRecentTweets(this.usedChar);
    console.log(this.orderedTweetsArray.length);
  }
}
