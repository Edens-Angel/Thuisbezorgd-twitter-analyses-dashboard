import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-agg-number',
  templateUrl: './agg-number.component.html',
  styleUrls: ['./agg-number.component.scss']
})
export class AggNumberComponent implements OnInit {
  @Input() component: any;
  constructor() { }

  ngOnInit(): void {
  }

}
