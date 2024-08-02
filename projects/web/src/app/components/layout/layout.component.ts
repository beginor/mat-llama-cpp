import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { LayoutService } from '../../services/layout.service';

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

    constructor(
        protected layout: LayoutService
    ) { }

}
