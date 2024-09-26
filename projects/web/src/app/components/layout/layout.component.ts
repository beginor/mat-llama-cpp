import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { LayoutService } from '../../services/layout.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        NzLayoutModule,
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
