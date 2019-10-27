import { Injectable, Inject, Optional, ɵConsole } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

const DEGREE_IN_RADIANS: number = Math.PI / 180;

@Injectable()
export class RoundClockService {
  private _base: HTMLBaseElement;
  private _hasPerf: boolean;
  public supportsSvg: boolean;

  constructor(@Optional() @Inject(DOCUMENT) document: any) {

    this.supportsSvg = !!(document && document.createElementNS
      && document.createElementNS('https://www.w3.org/2000/svg', 'svg').createSVGRect);
    this._base = document && document.head.querySelector('base');
    this._hasPerf = typeof window !== 'undefined' && window.performance && window.performance.now &&
      typeof window.performance.now() === 'number';
  }

  /**
   * Resolves a SVG color against the page's `base` tag.
   */
  resolveColor(color: string): string {
    if (this._base && this._base.href) {
      let hashIndex = color.indexOf('#');
      if (hashIndex > -1 && color.indexOf('url') > -1) {
        return color.slice(0, hashIndex) + location.href + color.slice(hashIndex);
      }
    }
    return color;
  }

  /**
   * Generates a timestamp.
   */
  getTimestamp(): number {
    return this._hasPerf ? window.performance.now() : Date.now();
  }

  /**
   * Generates the value for an SVG arc.
   * @param current       Current value.
   * @param bgCurrent
   * @param total         Maximum value.
   * @param pathRadius    Radius of the SVG path.
   * @param elementRadius Radius of the SVG container.
   * @param isSemicircle  Whether the element should be a semicircle.
   */
  getArc(from: number, to: number, total: number, pathRadius: number, elementRadius: number, isSemicircle = false): string {
    let value = Math.max(0, Math.min(from || 0, total));
    let value1 = Math.max(0, Math.min(to || 0, total));
    let maxAngle = isSemicircle ? 180 : 359.9999;
    let percentage = total === 0 ? maxAngle : (value / total) * maxAngle;
    let start = this._polarToCartesian(elementRadius, pathRadius, percentage);
    let percentage1 = total === 0 ? maxAngle : (value1 / total) * maxAngle;
    let end = this._polarToCartesian(elementRadius, pathRadius, percentage1);
    let between = (percentage1 - percentage) % maxAngle;

    if (between < 0) {
      between += maxAngle;
    }

    let arcSweep = (between <= 180 ? 0 : 1);

    return `M ${start} A ${pathRadius} ${pathRadius} 0 ${arcSweep} 1 ${end}`;
  };

  getBackgroundArc(bgStart: number, bgEnd: number, total: number, pathRadius: number, elementRadius: number, isSemicircle = false): string {
    let value = Math.max(0, Math.min(bgStart || 0, total));
    let value1 = Math.max(0, Math.min(bgEnd || 0, total));
    let maxAngle = isSemicircle ? 180 : 359.9999;
    let percentage = total === 0 ? maxAngle : (value / total) * maxAngle;
    let start = this._polarToCartesian(elementRadius, pathRadius, percentage);
    let percentage1 = total === 0 ? maxAngle : (value1 / total) * maxAngle;
    let end = this._polarToCartesian(elementRadius, pathRadius, percentage1);
    let between = (percentage1 - percentage) % maxAngle;

    if (between < 0) {
      between += maxAngle;
    }

    let arcSweep = (between <= 180 ? 0 : 1);

    return `M ${start} A ${pathRadius} ${pathRadius} 0 ${arcSweep} 1 ${end}`;
  };

  getEndlineStart(bgCurrent: number, total: number, pathRadius: number, elementRadius: number, isSemicircle = false): any {
    let value = Math.max(0, Math.min(bgCurrent || 0, total));
    let maxAngle = isSemicircle ? 180 : 359.9999;
    let percentage = total === 0 ? maxAngle : (value / total) * maxAngle;
    let start = this._lineToCartesianStart(elementRadius, pathRadius, percentage);

    return start;
  };

  getEndlineEnd(bgCurrent: number, total: number, pathRadius: number, elementRadius: number, isSemicircle = false): any {

    let value = Math.max(0, Math.min(bgCurrent || 0, total));
    let maxAngle = isSemicircle ? 180 : 359.9999;
    let percentage = total === 0 ? maxAngle : (value / total) * maxAngle;
    let start = this._lineToCartesianEnd(elementRadius, pathRadius, percentage);

    return start;
  };

  /**
   * Converts polar cooradinates to Cartesian.
   * @param elementRadius  Radius of the wrapper element.
   * @param pathRadius     Radius of the path being described.
   * @param angleInDegrees Degree to be converted.
   */
  private _polarToCartesian(elementRadius: number, pathRadius: number, angleInDegrees: number): string {

    let angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    let x = elementRadius + (pathRadius * Math.cos(angleInRadians)) + 15;
    let y = elementRadius + (pathRadius * Math.sin(angleInRadians)) + 15;

    return x + ' ' + y;
  }
  private _lineToCartesianStart(elementRadius: number, pathRadius: number, angleInDegrees: number): any {

    let angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    let x = elementRadius + (pathRadius * Math.cos(angleInRadians)) + 27.5;
    let y = elementRadius + (pathRadius * Math.sin(angleInRadians)) + 27.5;

    return { x: x, y: y };
  }
  private _lineToCartesianEnd(elementRadius: number, pathRadius: number, angleInDegrees: number): any {

    let angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    let x = elementRadius + (pathRadius * Math.cos(angleInRadians));
    let y = elementRadius + (pathRadius * Math.sin(angleInRadians)) + 3;

    return { x: x, y: y };
  }

};
