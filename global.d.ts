declare global {
	type Nullable<T> = T | null;
	type Optional<T> = T | undefined;
}

declare module '*.css';

export {};
