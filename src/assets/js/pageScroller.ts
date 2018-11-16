import {Injectable} from '@angular/core';

@Injectable()
export class PageScroller {
  private pages: NodeListOf<HTMLElement>;
  private currentPage: number;
  private delta: number;

  constructor() {
    const self = this;
    const scrollDelay = 500;

    this.currentPage = 0;
    this.delta = 0;

    let alreadySrolled = false;

    if ((<any>window).addEventListener) {
      (<any>document).addEventListener('DOMContentLoaded', getCurrentPage);

      if ('onwheel' in document) {
        (<any>window).addEventListener('wheel', onWheel);
      } else if ('onmousewheel' in document) {
        (<any>window).addEventListener('mousewheel', onWheel);
      } else {
        (<any>window).addEventListener('MozMousePixelScroll', onWheel);
      }
    } else {
      (<any>document).attachEvent('DOMContentLoaded', getCurrentPage);
      (<any>window).attachEvent('onmousewheel', onWheel);
    }

    function onWheel(e) {
      e = e || (<any>window).event;

      if (!alreadySrolled) {
        doPageScroll();
      }

      function doPageScroll() {
        alreadySrolled = true;

        setTimeout(() => {
          alreadySrolled = false;
        }, scrollDelay);

        self.delta = e.deltaY || e.detail || e.wheelDelta;

        if (self.delta > 0) {
          self.nextPage();
        } else if (self.delta < 0) {
          self.prevPage();
        }
      }

      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

    function getCurrentPage() {
      self.pages = document.querySelectorAll('.js-stroll-page');
      self.currentPage = Math.floor(window.scrollY / self.pages[0].offsetHeight);
    }
  }

  nextPage() {
    this.currentPage = (++this.currentPage === this.pages.length) ? (this.pages.length - 1) : this.currentPage;
    this.scrollToPage(this.pages[this.currentPage]);
  }

  prevPage() {
    this.currentPage = (--this.currentPage < 0) ? 0 : this.currentPage;
    this.scrollToPage(this.pages[this.currentPage]);
  }

  scrollToPage(page: HTMLElement) {
    try {
      const offset = page.getBoundingClientRect().top + pageYOffset;

      if ((<any>window).scroll) {
        (<any>window).scroll({
          top: offset,
          behavior: 'smooth'
        });
      } else {
        (<any>window).scrollTo(0, offset);
      }
    } catch {
      console.log('there is no sectionElement');
    }
  }
}
