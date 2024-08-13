import { computed, Injectable, signal } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    public isHandset = signal(false);

    public isOpen = computed(() => {
        if (this.siderOpened() === true) {
            return true;
        }
        return !this.isHandset();
    });

    private siderOpened = signal(false);

    constructor(breakpointObserver: BreakpointObserver) {
        breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
           this.isHandset.set(result.matches);
        });
    }

    public onSiderClosed() {
        this.siderOpened.set(false);
    }

    public openSider() {
        this.siderOpened.set(true);
    }

}
