import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-chat-options-dialog',
    standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatSlideToggleModule,
    ],
    templateUrl: './chat-options-dialog.component.html',
    styleUrl: './chat-options-dialog.component.css'
})
export class ChatOptionsDialogComponent {

    protected settings = {
        temperature: 0.8,
    }

    constructor(
        private dialogRef: MatDialogRef<ChatOptionsDialogComponent>,
    ) { }

    protected ok(): void {
        this.dialogRef.close('ok');
    }

    protected cancel(): void {
        this.dialogRef.close();
    }

}
