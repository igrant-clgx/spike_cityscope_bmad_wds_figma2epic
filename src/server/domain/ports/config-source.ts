/**
 * ConfigSource port (AD-2, AD-8). Serves versioned form configuration as data
 * (never hardcoded in client or handler code): renovation types (Step 1), items
 * tagged by `typeId` (Step 2), and dynamic property questions (Step 3).
 *
 * Plain TS types ONLY — the domain layer imports no vendor SDK (no `zod`, no
 * `@mui/*`, no `next`, no `react`). The shared zod schemas in
 * `src/shared/schemas/config.ts` mirror these shapes; a type-level test
 * (`config.test.ts`) asserts structural equivalence so the two never drift.
 * Keep optional fields optional here (`foo?: T`) to match `.optional()` there.
 *
 * The concrete adapter (JSON/file → CMS) is deferred; Story 3.1 ships a stub.
 * OI-1 (final Step 2 item content) and OI-2 (final Step 3 validation rules) are
 * `[OPEN]` — the shapes carry generic metadata only.
 */
export interface RenovationType {
  id: string;
  label: string;
}

export interface RenovationItem {
  id: string;
  typeId: string;
  label: string;
}

export interface QuestionOption {
  value: string;
  label: string;
}

interface QuestionBase {
  id: string;
  label: string;
  required: boolean;
  appliesToItemIds?: string[];
}

export interface RadioQuestion extends QuestionBase {
  kind: "radio";
  options: QuestionOption[];
}

export interface SelectQuestion extends QuestionBase {
  kind: "select";
  options: QuestionOption[];
}

export interface TextQuestion extends QuestionBase {
  kind: "text";
  maxLength?: number;
}

export interface NumericQuestion extends QuestionBase {
  kind: "numeric";
  min?: number;
  max?: number;
  step?: number;
}

export interface SliderQuestion extends QuestionBase {
  kind: "slider";
  min: number;
  max: number;
  step?: number;
}

export interface DateQuestion extends QuestionBase {
  kind: "date";
  minIso?: string;
  maxIso?: string;
}

export interface BudgetQuestion extends QuestionBase {
  kind: "budget";
  min: number;
  max: number;
  step?: number;
}

/** Discriminated union over `kind` covering all 7 UX-DR8 field kinds. */
export type PropertyQuestion =
  | RadioQuestion
  | SelectQuestion
  | TextQuestion
  | NumericQuestion
  | SliderQuestion
  | DateQuestion
  | BudgetQuestion;

export interface FormConfig {
  configVersion: string;
  renovationTypes: RenovationType[];
  items: RenovationItem[];
  questions: PropertyQuestion[];
}

export interface ConfigSource {
  getFormConfig(): Promise<FormConfig>;
}
