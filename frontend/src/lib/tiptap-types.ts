type TiptapAttrs = Record<string, unknown>;

export interface Mark {
  type: string;
  attrs?: TiptapAttrs;
}

export interface InlineContent {
  type: "text" | "image" | string;
  text?: string;
  marks?: Mark[];
}

export interface Block {
  type: string;
  attrs?: TiptapAttrs;
  content?: (InlineContent | Block)[];
}

export interface TiptapDocument {
  type: "doc";
  content: Block[];
}
