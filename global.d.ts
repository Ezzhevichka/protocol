declare global {
	type Nullable<T> = T | null;
	type Optional<T> = T | undefined;
	type SteamId = string;
}

declare module '*.css';

export {};
