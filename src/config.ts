export interface IValtConfig {
  baseURL: string;
  apiKey?: string;
}

let config: IValtConfig = {
  baseURL: "",
  apiKey: "",
};

export const initializeIValt = (configuration: IValtConfig) => {
  config = { ...config, ...configuration };
};

export const getConfig = () => config;
