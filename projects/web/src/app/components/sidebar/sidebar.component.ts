import { Component, OnInit, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu'

// import {
//     ChatFormatterComponent
// } from '../chat-formatter/chat-formatter.component';
import { NavService } from '../../services/nav.service';
import { ThemeType } from '../../services/layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        NzMenuModule,
        RouterLink,
        RouterLinkActive,
        // ChatFormatterComponent
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

    public theme = input<ThemeType>('dark');

    constructor(
        private router:  Router,
        protected vm: NavService
    ) {

    }

    public ngOnInit(): void {
        this.vm.loadData();
    }

    protected isActivated(url: string): boolean {
        return this.router.url.endsWith(url);
    }

    protected showChatModal(): void {

    }

}
