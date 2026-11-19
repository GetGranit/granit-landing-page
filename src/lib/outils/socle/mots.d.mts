export const SEUIL_DEFAUT: number;
export const MIN_VOISINS: number;
export const REPETITION_GABARIT: number;
export function compterMots(texte: string): number;
export function decouperPhrases(texte: string): string[];
export function phrasesGabarit(textes: readonly string[], repetition?: number): Set<string>;
export function motsPropres(texte: string, gabarit?: ReadonlySet<string>): number;
export function compterMotsPropres(textes: readonly string[], repetition?: number): number[];
