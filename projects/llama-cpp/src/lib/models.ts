export interface ServerHealth {
    status: string;
    slots_idle: number;
    slots_processing: number;
}

export interface ServerProps {
    user_name: string;
    assistant_name: string;
    default_generation_settings: GenerationSettings;
    total_slots: number;
}

export interface CompletionOptions {
    stream: boolean;
    dynatemp_range: number;
    dynatemp_exponent: number;
    n_predict: number;
    temperature: number;
    stop: string[];
    n_keep: number;
    repeat_last_n: number;
    repeat_penalty: number;
    penalize_nl: boolean;
    top_k: number;
    top_p: number;
    min_p: number;
    tfs_z: number;
    typical_p: number;
    presence_penalty: number;
    frequency_penalty: number;
    penalty_prompt: null | string | number[];
    mirostat: number;
    mirostat_tau: number;
    mirostat_eta: number;
    grammar: string | undefined;
    json_schema: Object | undefined;
    seed: number;
    ignore_eos: boolean;
    logit_bias: [string | number, number][];
    n_probs: number;
    min_keep: number;
    image_data: any[];
    cache_prompt: boolean;
    api_key: string | undefined;
    prompt: string;
    system_prompt: string | undefined;
    id_slot: number;
    samplers: string[];
}

export interface CompletionResponseBase {
    content: string;
    stop: boolean;
    id_slot: number;
}

export interface CompletionProgressResponse extends CompletionResponseBase {
    multimodal: boolean;
}

export interface CompletionFinalResponse extends CompletionResponseBase {
    model: string;
    tokens_predicted: number;
    tokens_evaluated: number;
    generation_settings: GenerationSettings;
    prompt: string;
    truncated: boolean;
    stopped_eos: boolean;
    stopped_word: boolean;
    stopped_limit: boolean;
    stopping_word: string;
    tokens_cached: number;
    timings: Timings;
}

export interface GenerationSettings {
    n_ctx: number;
    n_predict: number;
    model: string;
    seed: number;
    temperature: number;
    dynatemp_range: number;
    dynatemp_exponent: number;
    top_k: number;
    top_p: number;
    min_p: number;
    tfs_z: number;
    typical_p: number;
    repeat_last_n: number;
    repeat_penalty: number;
    presence_penalty: number;
    frequency_penalty: number;
    penalty_prompt_tokens: string[];
    use_penalty_prompt_tokens: boolean;
    mirostat: number;
    mirostat_tau: number;
    mirostat_eta: number;
    penalize_nl: boolean;
    stop: string[];
    n_keep: number;
    n_discard: number;
    ignore_eos: boolean;
    stream: boolean;
    logit_bias: string[],
    n_probs: number;
    min_keep: number;
    grammar: string;
    samplers: string[];
}

export interface Timings {
    prompt_n: number;
    prompt_ms: number;
    prompt_per_token_ms: number;
    prompt_per_second: number;
    predicted_n: number;
    predicted_ms: number;
    predicted_per_token_ms: number;
    predicted_per_second: number;
}

export interface Content {
    content: string;
}

export interface Embedding {
    embedding: number[];
}

export interface Tokens {
    tokens: number[];
}
