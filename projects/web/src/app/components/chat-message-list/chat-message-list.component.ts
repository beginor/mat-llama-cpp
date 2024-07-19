import { Component, ElementRef, Input, AfterViewChecked } from '@angular/core';

import { ChatMessage } from 'llama-cpp';

import {
    ChatMessageComponent
} from '../chat-message/chat-message.component';

@Component({
    selector: 'app-chat-message-list',
    standalone: true,
    imports: [ChatMessageComponent],
    templateUrl: './chat-message-list.component.html',
    styleUrl: './chat-message-list.component.css'
})
export class ChatMessageListComponent implements AfterViewChecked {

    @Input()
    public messages: ChatMessage[] = [];

    @Input()
    public answer = '';

    constructor(
        private elRef: ElementRef
    ) { }

    public ngAfterViewChecked(): void {
        const el = this.elRef.nativeElement as HTMLElement;
        const current = el.scrollTop;
        const amount = el.scrollHeight - el.clientHeight;
        if (current < amount) {
            el.scrollBy({
                left: 0,
                top: amount - current,
                behavior: 'smooth'
            });
        }
    }

    public getAnswerMessage(): ChatMessage {
        return {
            role: 'assistant',
            content: this.answer,
            timestamp: 0
        };
    }

}
