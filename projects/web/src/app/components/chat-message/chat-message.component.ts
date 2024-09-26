import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

import { ChatMessage } from 'llama-cpp';

@Component({
    selector: 'app-chat-message',
    standalone: true,
    providers: [
        provideMarkdown({}),
    ],
    imports: [
        NzCardModule,
        MarkdownModule,
    ],
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {

    @Input()
    public message!: ChatMessage;

}
