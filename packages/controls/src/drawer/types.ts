export type HeaderTemplateType = {
  $implicit: {
    close: () => void;
    text?: string;
    /**
     * Id the drawer's `aria-labelledby` points at. Place it on your heading element
     * in a custom `#header` template so the drawer keeps its accessible name.
     */
    headerId: string;
  };
};
