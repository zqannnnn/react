//https://stackoverflow.com/questions/42211175/typescript-hashmap-dictionary-interface
export interface StringKeyHash {
	[details: string]: any;
}
export interface HashOfStringKeyHash {
	[details: string]: StringKeyHash;
}
