export interface ProductData {
  title: string;
  description: string;
  image: string;
  price: string;
  url: string;
}

export interface GeneratedScript {
  hook: string;
  benefits: string;
  callToAction: string;
  fullScript: string;
  videoPrompt: string;
}

export interface VideoOperation {
  operationName: string;
  done: boolean;
  videoUrl?: string;
  error?: string;
}
