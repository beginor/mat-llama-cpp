import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { ChatOptionsDialogComponent } from '../chat-options-dialog/chat-options-dialog.component';

@Component({
    selector: 'app-chat-settings',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
    ],
    templateUrl: './chat-settings.component.html',
    styleUrl: './chat-settings.component.css'
})
export class ChatSettingsComponent implements OnInit {

    constructor(
        private dialog: MatDialog
    ) { }

    public ngOnInit(): void {
        this.showDialog();
    }

    protected showDialog(): void {
        const dialogRef = this.dialog.open(
            ChatOptionsDialogComponent,
            {
                width: '50vw',
                data: {}
            }
        );

    }

}
