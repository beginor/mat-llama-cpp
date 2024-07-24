import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    SidebarComponent
],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {

    protected isHandset$: Observable<boolean>;

    constructor(breakpointObserver: BreakpointObserver) {
        this.isHandset$ = breakpointObserver.observe(Breakpoints.Handset).pipe(
            map(result => result.matches),
            shareReplay()
        );
    }

}
