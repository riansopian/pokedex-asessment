import { Session } from "next-auth";
import { Move } from "pokenode-ts";

export interface UserSession extends Session {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	token?: UserToken;
}

export interface UserToken {
	name?: string | null;
	email?: string | null;
	picture?: string | null;
	sub?: string;
	iat?: number;
	exp?: number;
	jti?: string;
}

export interface LikedMon {
	pokemon_id: number;
}

export const meta = {
	title: "PokeDex",
	description: "Pokedex Web",
	keywords: ["Pokemon", "PokeLore", "Pokedex", "PokeApi"],
	// metadataBase: new URL(String(process.env.NEXTAUTH_URL)),
	robots: {
		follow: true,
		index: false,
		nocache: true,
	},
	openGraph: {
		title: "PokeDex",
		description: "Pokedex Web",
		images: "/logo.png",
		type: "website",
	},
	themeColor: "#f20c51",
};

export type MetaData = typeof meta;

export interface CustomMove extends Move {
	move_learn_method: string;
	level_learned_at?: number;
}
