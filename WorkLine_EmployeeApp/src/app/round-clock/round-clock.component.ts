import { Component, Input, Output, OnChanges, NgZone, EventEmitter, ViewChild, Renderer, ViewChildren } from '@angular/core';
import { RoundClockService } from './round-clock.service';
import { RoundClockConfig } from './round-clock.config';
import { RoundClockEase } from './round-clock.ease';
import { DomSanitizer } from '@angular/platform-browser';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
    selector: 'round-clock',
    template: `
        <svg xmlns="https://www.w3.org/2000/svg" [attr.viewBoxAt]="viewBoxAt[innerHTML]"
        [attr.width]="radius*2 + 30" [attr.height]="radius*2 + 30">
            <path
            #backgroundPath
            fill="none"
            [style.stroke-width]="stroke"
            [style.stroke]="resolveColor(background)"
            [style.stroke-linecap]="rounded ? 'round' : ''"
            [attr.transform]="pathTransform[innerHTML]"
            />
            <line #startLine x1="135" y1="40" x2="135" y2="0" [style.stroke] = "resolveColor(color)" [style.stroke-width]="2" />
            <line #endLine x1="95" y1="40" x2="95" y2="0" [style.stroke] = "resolveColor(color)" [style.stroke-width]="2" />
            <ng-template ngFor let-value [ngForOf]="values" let-i="index">
                <path
                    #path
                    fill="none"
                    [style.stroke-width]="stroke"
                    [style.stroke]="resolveColor(color)"
                    [style.stroke-linecap]="rounded ? 'round' : ''"
                    [attr.transform]="pathTransform[innerHTML]"
                    [attr.d]="getPath(value)"
                />
            </ng-template>
        </svg>
    `,
    host: {
        'role': 'progressbar',
        '[attr.aria-valuemin]': 'current',
        '[attr.aria-valuemax]': 'max',
        '[style.width]': "responsive ? '' : diameter[innerHTML] + 'px'",
        '[style.height]': "elementHeight",
        '[style.padding-bottom]': "paddingBottom",
        '[class.responsive]': 'responsive'
    },
    styles: [
        `:host {
            display: block;
            position: relative;
            overflow: hidden;
        }`,
        `:host.responsive {
            width: 100%;
            padding-bottom: 100%;
        }`,
        `:host.responsive > svg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }`
    ]
})

export class RoundClockComponent implements OnChanges {
    private _lastAnimationId: number = 0;
    elementHeight;
    paddingBottom;
    viewBoxAt;
    diameter;
    resColor;
    pathTransform;

    constructor(private _service: RoundClockService, private _easing: RoundClockEase, private _defaults: RoundClockConfig,
        private _ngZone: NgZone, private _renderer: Renderer, public sanitizer: DomSanitizer) {
    }

    /** Sets the path dimensions. */
    private _setPath(index: number, value: number, value1: number): void {
        if (this._paths) {
            this._renderer.setElementAttribute(this._paths.toArray()[index].nativeElement, 'd', this._service.getArc(value, value1,
                this.max, this.radius - this.stroke / 2, this.radius, this.semicircle));
        }
    }

    private _setBakcgroundPath(value: number, value1: number): void {
        if (this._backgroundPath) {
            this._renderer.setElementAttribute(this._backgroundPath.nativeElement, 'd', this._service.getBackgroundArc(value, value1,
                this.max, this.radius - this.stroke / 2, this.radius, this.semicircle));
            const start = this._service.getEndlineStart(value, this.max, this.radius - this.stroke,
                this.radius - this.stroke / 2, this.semicircle);
            const end = this._service.getEndlineEnd(value, this.max, this.radius + 10, this.radius + 15, this.semicircle);

            this._renderer.setElementAttribute(this._startLine.nativeElement, 'x1', start.x.toString());
            this._renderer.setElementAttribute(this._startLine.nativeElement, 'y1', start.y.toString());
            this._renderer.setElementAttribute(this._startLine.nativeElement, 'x2', end.x.toString());
            this._renderer.setElementAttribute(this._startLine.nativeElement, 'y2', end.y.toString());

            const start1 = this._service.getEndlineStart(value1, this.max, this.radius - this.stroke,
                this.radius - this.stroke / 2, this.semicircle);
            const end1 = this._service.getEndlineEnd(value1, this.max, this.radius + 10, this.radius + 15, this.semicircle);
            this._renderer.setElementAttribute(this._endLine.nativeElement, 'x1', start1.x.toString());
            this._renderer.setElementAttribute(this._endLine.nativeElement, 'y1', start1.y.toString());
            this._renderer.setElementAttribute(this._endLine.nativeElement, 'x2', end1.x.toString());
            this._renderer.setElementAttribute(this._endLine.nativeElement, 'y2', end1.y.toString());
        }
    }

    private getPath(value: any): any {
        return this._service.getArc(value.start, value.end,
            this.max, this.radius - this.stroke / 2, this.radius, this.semicircle);
    }

    /** Clamps a value between the maximum and 0. */
    private _clamp(value: number): number {
        return Math.max(0, Math.min(value || 0, this.max));
    }

    /** Determines the SVG transforms for the <path> node. */
    getPathTransform(): string {
        let diameter = this._diameter;

        if (this.semicircle) {
            return this.clockwise ?
                `translate(0, ${diameter}) rotate(-90)` :
                `translate(${diameter + ',' + diameter}) rotate(90) scale(-1, 1)`;
        } else if (!this.clockwise) {
            return `scale(-1, 1) translate(-${diameter} 0)`;
        }
    }

    /** Resolves a color through the service. */
    resolveColor(color: string): string {
        return this._service.resolveColor(color);
    }

    /** Change detection callback. */
    ngOnChanges(changes): void {
        this.elementHeight = this.sanitizer.bypassSecurityTrustStyle((this._elementHeight).toString());
        this.paddingBottom = this.sanitizer.bypassSecurityTrustStyle((this._paddingBottom).toString());
        this.viewBoxAt = this.sanitizer.bypassSecurityTrustStyle(this._viewBox.toString());
        this.diameter = this.sanitizer.bypassSecurityTrustStyle((this._diameter).toString());
        this.pathTransform = this.sanitizer.bypassSecurityTrustStyle((this.getPathTransform).toString());
        this.resColor = this.sanitizer.bypassSecurityTrustStyle((this.resolveColor).toString());

        if (changes.bgStart || changes.bgEnd) {
            this._setBakcgroundPath(this.bgStart, this.bgEnd);
        } else {
            this._setBakcgroundPath(this.bgStart, this.bgEnd);
        }
    }

    /** Diameter of the circle. */
    _diameter(): number {
        return (this.radius * 2);
    }

    /** The CSS height of the wrapper element. */
    _elementHeight(): string {
        if (!this.responsive) {
            return (this.semicircle ? this.radius : this.diameter) + 'px';
        }
    }

    /** Viewbox for the SVG element. */
    _viewBox(): string {
        let diameter = this._diameter;
        return `0 0 ${diameter} ${this.semicircle ? this.radius : diameter}`;
    }

    /** Bottom padding for the wrapper element. */
    _paddingBottom(): string {
        if (this.responsive) {
            return this.semicircle ? '50%' : '100%';
        }
    }

    @ViewChild('backgroundPath') _backgroundPath;
    @ViewChildren('path') _paths;
    @ViewChild('startLine') _startLine;
    @ViewChild('endLine') _endLine;
    @Input() values: any;
    @Input() bgStart: number;
    @Input() bgEnd: number;
    @Input() max: number;
    @Input() radius: number = this._defaults.get('radius');
    @Input() animation: string = this._defaults.get('animation');
    @Input() animationDelay: number = this._defaults.get('animationDelay');
    @Input() duration: number = this._defaults.get('duration');
    @Input() stroke: number = this._defaults.get('stroke');
    @Input() color: string = this._defaults.get('color');
    @Input() background: string = this._defaults.get('background');
    @Input() responsive: boolean = this._defaults.get('responsive');
    @Input() clockwise: boolean = this._defaults.get('clockwise');
    @Input() semicircle: boolean = this._defaults.get('semicircle');
    @Input() rounded: boolean = this._defaults.get('rounded');
    @Output() onRender: EventEmitter<number> = new EventEmitter();
}
