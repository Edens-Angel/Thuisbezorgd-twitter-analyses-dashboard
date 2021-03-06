import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {Layout, IconLayout} from '../interfaces/layout';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  name: any = undefined;
  layout: Layout[] = [];
  components: any = undefined;
  activeFilter: any;
  activePeriod: any;

  constructor(private breakpointObserver: BreakpointObserver, private activatedRoute: ActivatedRoute, private route: Router) {

    this.activatedRoute.queryParams.subscribe(value => {
      if (value.filter) {
        this.activeFilter = value.filter;
      }

      if (value.period) {
        this.activePeriod = value.period;
      }

      setTimeout(() => {
        this.name = window.sessionStorage.getItem('user_name')?.replace(/['"]+/g, '');
      }, 4000);
    });
  }

  periodFilterToString(): string {
    let formatted = '';

    if (this.activePeriod) {
      if (this.activePeriod === 'm') {
        formatted = 'afgelopen maand';
      }

      if (this.activePeriod === 'w') {
        formatted = 'afgelopen week';
      }

      if (this.activePeriod === 'd') {
        formatted = 'vandaag';
      }
    }

    return formatted;
  }

  ngOnInit(): void {
    const topTweeterLayout: IconLayout = {
      title: 'Top Tweeter',
      type: 'agg-numbers',
      icon: 'star',
      selector: 't_t',
      class: 'primary',
      cols: 4,
      rows: 4,
      show: true,
    };
    const tweetUsersLayout: IconLayout = {
      title: 'Gebruikers',
      type: 'agg-numbers',
      selector: 'u',
      icon: 'group',
      class: 'teal',
      cols: 4,
      rows: 4,
      show: true,
    };
    const tweetsLayout: IconLayout = {
      title: 'Tweets',
      type: 'agg-numbers',
      selector: 'twt',
      icon: 'chat',
      class: 'blue',
      cols: 4,
      rows: 4,
      show: true,
    };
    const hashtagsLayout: IconLayout = {
      title: 'Hashtags',
      type: 'agg-numbers',
      selector: 'h',
      icon: 'tag',
      class: 'purple',
      cols: 4,
      rows: 4,
      show: true,
    };
    const wordcloudLayout: Layout = {
      title: 'Wordcloud van de dag',
      type: 'wordcloud',
      cols: 4,
      rows: 18,
      show: true,
    };
    const timelineLayout: Layout = {
      title: 'Tijdlijn Tweets',
      type: 'plotly-plot:timeline',
      enableButtons: true,
      cols: 4,
      rows: 18,
      show: true,
      layout: {autosize: true, barmode: 'stack'}
    };
    const last5TweetsLayout: Layout = {
      title: 'Laatste 5 Tweets',
      type: 'plotly-table',
      cols: 4,
      rows: 18,
      show: true,
    };
    const sentimentTweetsLayout: Layout = {
      title: 'Sentiment Tweets',
      type: 'plotly-plot:sentiment',
      enableButtons: false,
      cols: 4,
      rows: 18,
      show: true,
      layout: {autosize: true, barmode: 'stack'}
    }
    let hashtagAndUsersLayout: Layout = {
      title: 'Hashtags en gebruikers',
      type: 'plotly-plot:hashtag+user',
      enableButtons: false,
      cols: 4,
      rows: 18,
      show: true,
      layout: {autosize: true, barmode: 'stack'}
    }

    this.components = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small,
      Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).pipe(
      map((breakpointer) => {
        const indexes = Object.keys(breakpointer.breakpoints);
        const xs = breakpointer.breakpoints[indexes[0]];
        const s = breakpointer.breakpoints[indexes[1]];
        const m = breakpointer.breakpoints[indexes[2]];
        const l = breakpointer.breakpoints[indexes[3]];
        const xl = breakpointer.breakpoints[indexes[4]];

        this.layout = [
          topTweeterLayout,
          tweetUsersLayout,
          tweetsLayout,
          hashtagsLayout,
          timelineLayout,
          hashtagAndUsersLayout,
          sentimentTweetsLayout,
          wordcloudLayout,
          last5TweetsLayout,
        ];

        if (xs == breakpointer.matches) {
          return this.layout;
        }

        if (s == breakpointer.matches) {
          return this.layout;
        }

        if (m == breakpointer.matches) {
          return this.layout;
        }

        if (l == breakpointer.matches) {

          this.layout[0].cols = this.layout[1].cols = this.layout[2].cols = this.layout[3].cols = 1;
          this.layout[0].rows = this.layout[1].rows = this.layout[2].rows = this.layout[3].rows = 4;

          this.layout[6].cols = this.layout[5].cols = this.layout[7].cols =  2;
          this.layout[4].cols = this.layout[8].cols = 4;

          return this.layout;
        }

        if (xl == breakpointer.matches) {
          this.layout[0].cols = this.layout[1].cols = this.layout[2].cols = this.layout[3].cols = 1;
          this.layout[0].rows = this.layout[1].rows = this.layout[2].rows = this.layout[3].rows = 6;

          this.layout[6].cols = this.layout[5].cols = this.layout[7].cols = 2;
          this.layout[4].cols = this.layout[8].cols = 4;

          return this.layout;
        }
        return this.layout;
      })
    );
  }

  removeFilter(): void {
    this.activeFilter = null;
    this.activePeriod = null;
    this.route.navigate(['dashboard']);
  }
}
