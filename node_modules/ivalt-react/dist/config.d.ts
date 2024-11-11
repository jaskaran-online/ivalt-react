export interface IValtConfig {
    baseURL: string;
    apiKey?: string;
}
export declare const initializeIValt: (configuration: IValtConfig) => void;
export declare const getConfig: () => IValtConfig;
