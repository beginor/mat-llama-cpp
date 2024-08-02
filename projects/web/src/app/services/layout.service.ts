import { Injectable, signal } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    public isHandset = signal(false);

    constructor(breakpointObserver: BreakpointObserver) {
        breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
           this.isHandset.set(result.matches);
        });
    }

}
