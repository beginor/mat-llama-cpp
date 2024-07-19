import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'

// import {
//     ChatFormatterComponent
// } from '../chat-formatter/chat-formatter.component';
import { NavService } from '../../services/nav.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        MatListModule,
        RouterLink,
        RouterLinkActive,
        // ChatFormatterComponent
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

    constructor(public vm: NavService) { }

    public ngOnInit(): void {
        this.vm.loadData();
    }

}
