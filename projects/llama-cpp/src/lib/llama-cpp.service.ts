import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import {
    ServerHealth,
    ServerProps,
    GenerationSettings,
    CompletionOptions,
    CompletionResponseBase,
    CompletionFinalResponse,
    Timings,
    Embedding,
    Content,
    Tokens
} from './models';

@Injectable({
    providedIn: 'root'
})
export class LlamaCppService {

    public baseUrl = '';

    public health = new BehaviorSubject<ServerHealth>({} as ServerHealth);
    public props = new BehaviorSubject<ServerProps>(
        { default_generation_settings: {} } as ServerProps
    );
    public defaultGenerationSettings = new BehaviorSubject<GenerationSettings>(
        {} as GenerationSettings
    );
    public timings = new BehaviorSubject<Timings>({} as Timings);

    constructor(
        private http: HttpClient
    ) { }

    public embedding(content: Content): Observable<Embedding> {
        return this.http.post<Embedding>(
            `${this.baseUrl}/embedding`,
            content
        );
    }

    public tokenize(content: Content): Observable<Tokens> {
        return this.http.post<Tokens>(
            `${this.baseUrl}/tokenize`,
            content
        );
    }

    public detokenize(tokens: Tokens): Observable<Content> {
        return this.http.post<Content>(
            `${this.baseUrl}/detokenize`,
            tokens
        );
    }

    public createCompletionOptions(
        params: Partial<CompletionOptions>
    ): CompletionOptions {
        const defaultOptions = this.createDefaultOptions();
        Object.assign(defaultOptions, params);
        return defaultOptions;
    }

    public completion(
        options: CompletionOptions,
        signal: AbortSignal | undefined = undefined
    ): Observable<string> {
        const observable = new Observable<string>((subscriber) => {
            /*
            fetch(`${this.baseUrl}/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(options),
                signal
            }).then(res => {
                if (!options.stream) {
                    res.json().then((json: CompletionFinalResponse) => {
                        subscriber.next(json.content);
                        this.timings.next(json.timings);
                    }).catch(ex => {
                        subscriber.error(ex);
                    }).finally(() => {
                        subscriber.complete();
                    });
                }
                else {
                    const reader = res.body!.getReader();
                    let done = false;
                    let value: Uint8Array | undefined;
                    const decoder = new TextDecoder();
                    while (!done) {

                        reader.read().then(r => {
                            done = r.done;
                            value = r.value;
                        })
                    }
                }
            }).catch(ex => {
                subscriber.error(ex);
            })
            */
        });
        return observable;
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
            this.timings.next(json.timings);
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
                                this.timings.next(fr.timings);
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
                this.props.next(value);
                this.defaultGenerationSettings.next(
                    value.default_generation_settings
                );
            },
            error: err => {
                this.props.error(err);
                this.defaultGenerationSettings.error(err);
            }
        });
    }

}
