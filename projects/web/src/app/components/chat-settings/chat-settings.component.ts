import { Component, OnInit } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

// import { ChatOptionsDialogComponent } from '../chat-options-dialog/chat-options-dialog.component';

@Component({
    selector: 'app-chat-settings',
    standalone: true,
    imports: [
        NzButtonModule,
        NzIconModule,
        NzModalModule,
    ],
    templateUrl: './chat-settings.component.html',
    styleUrl: './chat-settings.component.css'
})
export class ChatSettingsComponent implements OnInit {

    constructor(
        private dialog: NzModalService
    ) { }

    public ngOnInit(): void {
        this.showDialog();
    }

    protected showDialog(): void {
        // const dialogRef = this.dialog.create(
        //     ChatOptionsDialogComponent,
        //     {
        //         width: '50vw',
        //         data: {}
        //     }
        // );

    }

}
