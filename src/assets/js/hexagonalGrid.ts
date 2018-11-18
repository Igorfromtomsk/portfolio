export class HexagonalGrid {
  constructor(private prop: Props) {
  }

  make() {
    this.setSettings();

    for (let r = 0; r < this.prop.rounds; ++r) {
      this.createCell(r);
    }
  }

  private setSettings() {
    this.prop.container = <HTMLElement>document.querySelectorAll(this.prop.parentClassSelector)[0];
    this.prop.height = this.prop.container.getBoundingClientRect().height || 300;
    this.prop.width = this.prop.container.getBoundingClientRect().width || 1000;
    this.prop.rounds = this.prop.width / (2 * this.prop.ballsDistance) + 1;
    this.prop.index = 0;

    this.prop.container.style.overflow = 'hidden';
  }

  private createCell(round) {
    let x, y, offsetX, offsetY;
    this.prop.currentRound = (round > 10) ? 10 : round;

    if (!round) {
      const ball = new Ball(this.prop);

      ball.make(true);
      ball.toCenter();
      ball.fill(this.prop.index);
      ball.append();
    } else {
      for (let i = 0; i < 6; i++) {
        const angle = 60 * i;

        for (let j = 0; j < round; ++j) {
          offsetX = this.prop.ballsDistance * round * Math.cos(this.degToRad(angle - 60)) * j / round;
          offsetY = this.prop.ballsDistance * round * Math.sin(this.degToRad(angle - 60)) * j / round;

          x = this.prop.ballsDistance * round * Math.cos(this.degToRad(angle)) - offsetX;
          y = this.prop.ballsDistance * round * Math.sin(this.degToRad(angle)) - offsetY;

          if (Math.abs(y) < this.prop.height / 2) {
            const ball = new Ball(this.prop);
            ball.make();

            ball.toPosition({x, y});

            ++this.prop.index;
            ball.fill(this.prop.index);
            ball.append();
          }
        }
      }
    }
  }

  private degToRad(deg) {
    return (deg * 3.14) / 180;
  }
}

class Ball {
  ball_: HTMLElement;

  constructor(private prop: Props) {
  }

  make(isCentralBall = false) {
    this.ball_ = document.createElement('div');
    this.ball_.classList.add('balls-item', 'ball', 'ball-round-' + this.prop.currentRound);

    if (isCentralBall) {
      this.ball_.style.width = this.ball_.style.height = this.prop.centralBallRadius + 'px';
    } else {
      this.ball_.style.width = this.ball_.style.height = this.prop.ballRadius + 'px';
    }
  }

  fill(index) {
    if (this.prop.source) {
      const img = document.createElement('img');

      img.src = this.prop.source[index % this.prop.source.length];
      this.ball_.appendChild(img);
    } else {
      this.ball_.innerText = index;
    }
  }

  append() {
    this.prop.container.appendChild(this.ball_);
  }

  toPosition(coords: Coords) {
    this.ball_.style.left = 'calc(50% + ' + coords.x + 'px)';
    this.ball_.style.top = 'calc(50% + ' + coords.y + 'px)';
  }

  toCenter() {
    this.ball_.style.left = '50%';
    this.ball_.style.top = '50%';
  }
}

interface Coords {
  x: number;
  y: number;
}

interface Props {
  parentClassSelector?: string;
  ballRadius?: number;
  centralBallRadius?: number;
  ballsDistance?: number;
  container?: HTMLElement;
  height?: number;
  width?: number;
  rounds?: number;
  index?: number;
  currentRound?: number;
  source?: string[];
}
