import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LlamaService, PromptService } from 'llama';

@Component({
    selector: 'app-chat-formatter',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './chat-formatter.component.html',
    styleUrl: './chat-formatter.component.css',
})
export class ChatFormatterComponent implements OnInit, OnDestroy {

    protected model = signal('');
    protected isKnown = signal(false);

    constructor(
        private prompt: PromptService,
        private llama: LlamaService
    ) { }

    public ngOnInit(): void {
        const model = this.llama.model;
        const formatter = this.prompt.getFormatter(model);
        this.model.set(model);
        this.isKnown.set(formatter.isKnownModel);
    }

    public ngOnDestroy(): void {
        console.log('ChatFormatterComponent destroyed');
    }

}
