import {Injectable} from '@angular/core';

@Injectable()
export class LavaLampBg {
  constructor() {
  }

  init() {
    const c = document.createElement('canvas'),
      fc = <HTMLCanvasElement>document.getElementById('js_main_section_bg');
    let w, h, ctx, fctx, opts, orbs;

    w = c.width = fc.width = 200;
    h = c.height = fc.height = 350;
    ctx = c.getContext('2d');
    fctx = fc.getContext('2d');

    opts = {
      orbCount: 25,
      baseRadius: 40,
      addedRadius: 50,
      baseVel: .1,
      addedVel: 1,

      alphaThreshold: 200
    };

    orbs = [];

    for (let j = 0; j < opts.orbCount; ++j) {
      orbs.push(new Orb);
    }

    Orb.prototype.step = function () {
      this.x += this.vx;
      this.y += this.vy;

      const radius = this.radius / 2;

      if (this.x < -radius || this.x > w + radius) {
        this.vx *= -1;
      }

      if (this.y < -radius || this.y > h + radius) {
        this.vy *= -1;
      }


      ctx.fillStyle = this.gradient;
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.translate(-this.x, -this.y);
    };

    function anim() {
      window.requestAnimationFrame(anim);

      ctx.clearRect(0, 0, w, h);
      fctx.fillStyle = 'black';
      fctx.fillRect(0, 0, w, h);

      for (let i = 0; i < orbs.length; i++) {
        orbs[i].step();
      }

      const image = ctx.getImageData(0, 0, w, h),
        data = new Uint8Array(image.data.buffer);

      for (let i = 3; i < data.length; i += 4) {
        data[i] /= data[i] < opts.alphaThreshold ? 6 : 1;
      }

      fctx.putImageData(image, 0, 0);
    }

    function Orb() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;

      this.radius = opts.baseRadius + opts.addedRadius * Math.random();


      const color = 'hsla(hue,0%,0%,alp)'.replace('hue', (Math.random() * 40).toString());

      this.gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
      this.gradient.addColorStop(0, color.replace('alp', (1).toString()));
      this.gradient.addColorStop(1, color.replace('alp', (0).toString()));

      const radiant = Math.random() * Math.PI * 2,
        vel = opts.baseVel + opts.addedVel * Math.random();

      this.vx = Math.cos(radiant) * vel;
      this.vy = Math.sin(radiant) * vel;
    }

    anim();
  }
}
