declare global {
  interface Window {
    JobSearchWidgets?: {
      init: () => void;
      version: string;
    };
  }
}

export {};