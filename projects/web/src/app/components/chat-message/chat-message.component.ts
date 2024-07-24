import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

import { ChatMessage } from 'llama-cpp';

@Component({
    selector: 'app-chat-message',
    standalone: true,
    providers: [
        provideMarkdown({}),
    ],
    imports: [
        MatCardModule,
        MarkdownModule,
    ],
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {

    @Input()
    public message!: ChatMessage;

}
