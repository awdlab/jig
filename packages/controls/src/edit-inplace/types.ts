export type EditTemplateType = {
  $implicit: {
    close: () => void;
    value: string;
    update: (value: string) => void;
  };
};
export type DisplayTemplateType = {
  $implicit: {
    value: string;
  };
};
