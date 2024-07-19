import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    ChatPrompt, ChatMessage, LlamaService, PromptService
} from 'llama-cpp';

import {
    ChatMessageListComponent
} from '../../components/chat-message-list/chat-message-list.component';
import {
    ChatInputComponent, ChatInput
} from '../../components/chat-input/chat-input.component';
import { UIState } from '../../components/ui-state';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        ChatMessageListComponent,
        ChatInputComponent
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent {

    public messages: ChatMessage[] = [];

    public answer = '';

    public state: UIState = 'idle';
    public input: ChatInput = { text: '' };

    private chatPrompt!: ChatPrompt;

    constructor(
        route: ActivatedRoute,
        private llamaService: LlamaService,
        private promptService: PromptService,
    ) {
        route.params.subscribe(params => {
            const prompt = params['prompt'] as string;
            this.chatPrompt = {
                system: '',
                messages: [],
            };
            this.promptService.loadPrompt<ChatPrompt>(`/prompts/${prompt}.json`).then(result => {
                this.chatPrompt.system = result.system;
                this.input.text = result.messages[0].content;
            }).catch(ex => {
                console.error(ex);
            });
            this.messages = [];
        });
    }

    public async onInputTextChange(text: string): Promise<void> {
        this.state = 'busy';
        this.chatPrompt.messages.push({ role: 'user', content: text });
        this.messages.push(
            { role: 'user', content: text, timestamp: Date.now() }
        );
        this.input.text = '';

        const model = this.llamaService.model;
        const { formatter } = this.promptService.getFormatter(model);

        const prompt = formatter.formatChat(this.chatPrompt);
        const params = this.llamaService.createCompletionOptions({
            stream: true,
            prompt: prompt,
            cache_prompt: true,
            n_predict: 2048,
            temperature: 0.5,
            stop: [...formatter.stopAt()]
        });

        const textStream = this.llamaService.streamCompletion(params);

        for await (const textPart of textStream) {
            this.answer += textPart;
        }
        const fullAnswer = this.answer;
        this.answer = '';

        const message: ChatMessage = {
            role: 'assistant',
            content: fullAnswer,
            timestamp: Date.now()
        };

        this.chatPrompt.messages.push(message);
        this.messages.push(message);

        this.state = 'idle';
    }

}
