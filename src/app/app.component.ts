import {Component, OnInit} from '@angular/core';
import {PageScroller} from '../assets/js/pageScroller';
import {LavaLampBg} from '../assets/js/lavaLampBg';
import {Terminal} from '../assets/js/Terminal';
import {HexagonalGrid} from '../assets/js/hexagonalGrid';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  backgroundLavaLamp: LavaLampBg;
  hexagonalGrid: HexagonalGrid;
  terminal: Terminal;

  constructor() {
    this.backgroundLavaLamp = new LavaLampBg();
    this.hexagonalGrid = new HexagonalGrid({
      parentClassSelector: '.hexagonal-grid-box',
      source: [
        'assets/images/cats/1.jpg', 'assets/images/cats/2.jpg',
        'assets/images/cats/3.jpg', 'assets/images/cats/4.jpg',
        'assets/images/cats/5.jpg', 'assets/images/cats/6.jpg',
        'assets/images/cats/7.jpg', 'assets/images/cats/8.jpg'
      ],
      ballRadius: 130,
      centralBallRadius: 165,
      ballsDistance: 170
    });
    this.terminal = new Terminal();

    const pageScroller = new PageScroller();
  }

  ngOnInit() {
    this.backgroundLavaLamp.init();
    this.hexagonalGrid.make();
    this.terminal.make();
  }

  toggleDescription(section: string, e) {
    e.preventDefault();
    document.querySelectorAll('.' + section)[0].classList.toggle('section_description-is-shown');
  }
}
