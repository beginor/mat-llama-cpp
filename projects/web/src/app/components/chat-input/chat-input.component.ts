import { Component, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { UIState } from '../ui-state';

@Component({
    selector: 'app-chat-input',
    standalone: true,
    imports: [
        FormsModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
    ],
    templateUrl: './chat-input.component.html',
    styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {

    public readonly state = input<UIState>('idle');

    public readonly text = input<string>('');
    public readonly textChanged = output<string>();

    protected textValue = '';

    constructor() {
        effect(() => {
            this.textValue = this.text();
        });
    }

    public sendText(): void {
        const text = this.textValue.trim();
        this.textChanged.emit(text);
    }

    public canSendText(): boolean {
        return this.state() === 'idle' && !!this.textValue.trim();
    }

}
