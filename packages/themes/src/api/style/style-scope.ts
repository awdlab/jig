export type StyleScope =
  | {
      kind: 'attribute';
      name: string;
      value?: string;
    }
  | {
      kind: 'class';
      name: string;
    }
  | {
      kind: 'id';
      name: string;
    }
  | {
      kind: 'tag';
      name: string;
    };
