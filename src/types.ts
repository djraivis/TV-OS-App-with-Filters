export interface AppConfig {
  friendlyName: string;
  url?: string;
  keyCode?: number;
  awsName?: string;
  app: {
    type: 'ctv' | 'tal';
    version?: string;
  };
  environment: {
    type: 'production' | 'ppdev' | 'preprod';
    subType?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'devtools' | 'partners' | 'playground' | 'suitest' | 'uktv';
  };
  platform: {
    brand: string;
    model?: string;
  };
}

export type FilterType = 'all' | 'ctv' | 'tal';
export type EnvType = 'all' | 'ppdev' | 'preprod' | 'production';
export type PlatformType = 'all' | 'googletv' | 'amazon' | 'fvp' | 'youview' | 'freesat' | 'vm' | 'sky' | 'lg';
export type PpdevSubType = 'all' | 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'devtools';
export type PreprodSubType = 'all' | 'partners' | 'playground' | 'suitest' | 'uktv';
export type NavigationMode = 'vim' | 'arrows' | 'remote';

export interface InfoPanelSettings {
  showDeviceInfo: boolean;
  showNavigationMode: boolean;
  showNavigationInstructions: boolean;
  showPublicIp: boolean;
  showLocalIp: boolean;
}