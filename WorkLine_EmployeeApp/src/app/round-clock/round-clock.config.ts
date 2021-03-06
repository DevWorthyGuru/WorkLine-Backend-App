import {Injectable} from '@angular/core';

export interface RoundClockDefaults {
  radius?: number;
  animation?: string;
  animationDelay?: number;
  duration?: number;
  stroke?: number;
  color?: string;
  background?: string;
  responsive?: boolean;
  clockwise?: boolean;
  semicircle?: boolean;
  rounded?: boolean;
}

@Injectable()
export class RoundClockConfig {
  private _options: RoundClockDefaults = {
    radius: 125,
    animation: 'easeOutCubic',
    animationDelay: null,
    duration: 500,
    stroke: 15,
    color: '#45CCCE',
    background: '#EAEAEA',
    responsive: false,
    clockwise: true,
    semicircle: false,
    rounded: false
  };

  /** Configures the defaults. */
  setDefaults(config: RoundClockDefaults): RoundClockDefaults {
    return (<any>Object).assign(this._options, config);
  }

  /** Fetches a value from the defaults. */
  get(key: string) {
    return this._options[key];
  }
}
