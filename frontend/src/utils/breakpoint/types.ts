export type MediaObject = Record<string, string>;
export enum MediaOperators {
    LESS,
    MORE,
}
export interface ParseMediaCheckRule {
    equal: boolean;
    value: number;
    type: MediaOperators;
}
export interface ParseMediaBreakPoint {
    className: string;
    check: ParseMediaCheckRule[];
}
