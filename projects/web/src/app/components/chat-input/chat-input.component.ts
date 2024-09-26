import { Component, EventEmitter, Input, Output } from '@angular/core';
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

    @Input()
    public state: UIState = 'idle';

    @Input()
    public input: ChatInput = { text: '' };
    @Output()
    public inputTextChanged = new EventEmitter<string>();

    public sendText(): void {
        this.inputTextChanged.next(this.input.text);
    }

    public canSendText(): boolean {
        return this.state === 'idle'
            && !!this.input.text.trim();
    }

}

export interface ChatInput {
    text: string;
}
