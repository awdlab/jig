import type { Type } from '@angular/core';

export type MdCfg = {
  mdFile: string;
  components?: Type<unknown>[];
};

/** A content heading collected from rendered markdown, used to build the TOC. */
export type TocEntry = {
  /** Unique slug assigned to the heading element (its DOM `id`). */
  id: string;
  /** Visible heading text. */
  text: string;
  /** Heading level (1–6) taken from the tag name. */
  level: number;
};
