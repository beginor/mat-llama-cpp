import { Component, Input } from '@angular/core';
import { ChatMessage } from 'llama-cpp';

@Component({
    selector: 'app-chat-message',
    standalone: true,
    imports: [],
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {

    @Input()
    public message!: ChatMessage;

}
