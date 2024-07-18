import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import {
    ServerHealth, ServerProps, GenerationSettings, CompletionOptions,
    CompletionResponseBase, CompletionFinalResponse, Timings, Embedding,
    Content, Tokens,
} from './models';
import { PromptFormatter } from './prompts';
import { formatters } from './formatters';

@Injectable({
    providedIn: 'root'
})
export class LlamaCppService {

    public baseUrl: string;

    public health: ServerHealth;
    public props: ServerProps;
    public defaultGenerationSettings: GenerationSettings;
    public timings: Timings;

    public get model(): string {
        const model = this.defaultGenerationSettings.model;
        if (model) {
            return model.substring(model.lastIndexOf('/') + 1).toLowerCase();
        }
        return '';
    }

    constructor(
        private http: HttpClient
    ) {
        this.baseUrl = '';
        this.health = {} as ServerHealth;
        this.props = { default_generation_settings: {} } as ServerProps;
        this.defaultGenerationSettings = this.props.default_generation_settings;
        this.timings = {} as Timings;
    }

    public embedding(
        content: Content
    ): Promise<Embedding> {
        return lastValueFrom(this.http.post<Embedding>(
            `${this.baseUrl}/embedding`,
            content
        ));
    }

    public tokenize(
        content: Content
    ): Promise<Tokens> {
        return lastValueFrom(this.http.post<Tokens>(
            `${this.baseUrl}/tokenize`,
            content
        ));
    }

    public detokenize(
        tokens: Tokens
    ): Promise<Content> {
        return lastValueFrom(this.http.post<Content>(
            `${this.baseUrl}/detokenize`,
            tokens
        ));
    }

    public createCompletionOptions(
        params: Partial<CompletionOptions>
    ): CompletionOptions {
        const defaultOptions = this.createDefaultOptions();
        Object.assign(defaultOptions, params);
        return defaultOptions;
    }

    public async *streamCompletion(
        options: CompletionOptions,
        signal: AbortSignal | undefined = undefined
    ): AsyncIterable<string> {
        const apiUrl: string = `${this.baseUrl}/completions`;
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(options),
            signal
        });
        if (!options.stream) {
            const json = await res.json() as CompletionFinalResponse;
            this.timings = json.timings;
            yield Promise.resolve(json.content);
        }
        else {
            const reader = res.body!.getReader();
            let done = false;
            let value: Uint8Array | undefined;
            const decoder = new TextDecoder();
            while (!done) {
                ({done, value} = await reader.read());
                const line = decoder.decode(value);
                const prefix = 'data:';
                if (line.startsWith(prefix)) {
                    const text = line.substring(prefix.length + 1).trim();
                    if (text) {
                        try {
                            const json = JSON.parse(text) as CompletionResponseBase;
                            const content = json.content;
                            if (json.stop) {
                                const fr = json as CompletionFinalResponse;
                                this.timings = fr.timings;
                            }
                            yield Promise.resolve(content);
                        }
                        catch (ex) {
                            yield Promise.resolve('');
                            console.error(text);
                            console.error(ex);
                        }
                    }
                }
            }
        }
    }

    private createDefaultOptions(): CompletionOptions {
        return {
            prompt: 'You are a helpful assistant',
            temperature: 0.8,
            dynatemp_range: 0.0,
            dynatemp_exponent: 1.0,
            top_k: 40,
            top_p: 0.95,
            min_p: 0.05,
            n_predict: -1,
            n_keep: 0,
            stream: true,
            stop: [],
            tfs_z: 1.0,
            typical_p: 1.0,
            repeat_penalty: 1.1,
            repeat_last_n: 64,
            penalize_nl: true,
            presence_penalty: 0.0,
            frequency_penalty: 0.0,
            penalty_prompt: null,
            mirostat: 0,
            mirostat_tau: 5.0,
            mirostat_eta: 0.1,
            grammar: undefined,
            json_schema: undefined,
            seed: -1,
            ignore_eos: false,
            logit_bias: [],
            n_probs: 0,
            min_keep: 0,
            image_data: [],
            id_slot: -1,
            cache_prompt: false,
            system_prompt: undefined,
            samplers: [
                'top_k', 'tfs_z', 'typical_p', 'top_p', 'min_p', 'temperature'
            ],
            api_key: undefined,
        };
    }

    public checkHealth(): void {
        this.http.get<ServerHealth>(`${this.baseUrl}/health`, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
            },
        }).subscribe({
            next: value => {
                this.health = value;
            },
            error: ex => {
                this.health = {} as ServerHealth;
            }
        });
    }

    public checkProps(): void {
        this.http.get<ServerProps>(`${this.baseUrl}/props`, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
            }
        }).subscribe({
            next: (value) => {
                this.props = value;
                const settings = value.default_generation_settings;
                this.defaultGenerationSettings = settings;
            },
            error: err => {
                this.props = {} as ServerProps;
                this.defaultGenerationSettings = {} as GenerationSettings;
            }
        });
    }

    public getFormatter(): FormatterInfo {
        const model = this.model;
        let formatter: string;
        let isKnownModel: boolean;
        console.log(`Current model is: ${model}`);
        if (model.indexOf('phind-codellama') > -1) {
            formatter = 'markdown';
            isKnownModel = true;
        }
        else if (model.indexOf('codellama') > -1
            || model.indexOf('llama-2') > -1
            || model.indexOf('llama2') > -1
            || model.indexOf('mistral') > -1
        ) {
            formatter = 'llama2';
            isKnownModel = true;
        }
        else if (model.indexOf('llama-3') > -1
            || model.indexOf('llama3') > -1
        ) {
            formatter = 'llama3';
            isKnownModel = true;
        }
        else if (model.indexOf('qwen') > -1
            || model.indexOf('yi') > -1
        ) {
            formatter = 'chatml';
            isKnownModel = true;
        }
        else if (model.indexOf('gemma-2') > -1) {
            formatter = 'gemma2';
            isKnownModel = true;
        }
        else if (model.indexOf('phi-3') > -1) {
            formatter = 'phi3';
            isKnownModel = true;
        }
        else {
            formatter = 'chatml';
            isKnownModel = false;
        }
        return {
            formatter: formatters[formatter],
            isKnownModel
        };
    }

}

export interface FormatterInfo {
    formatter: PromptFormatter;
    isKnownModel: boolean;
}
