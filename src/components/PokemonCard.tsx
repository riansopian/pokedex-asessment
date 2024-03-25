"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pokemon } from "pokenode-ts";
import React from "react";
import { BiGitCompare } from "react-icons/bi";
import { useRecoilState } from "recoil";

import { compareMons } from "./atoms/compareMons";

export default function PokemonCard({ pokemon, path = "" }: { pokemon: Pokemon; path?: string }): React.JSX.Element {
	const [compare, setCompare] = useRecoilState(compareMons);
	const router = useRouter();
	const toggleCompare = (pokemon: Pokemon): void => {
		if (compare.mon_1 && compare.mon_1.id === pokemon.id) {
			setCompare({ ...compare, mon_1: undefined });
		}
		if (compare.mon_2 && compare.mon_2.id === pokemon.id) {
			setCompare({ ...compare, mon_2: undefined });
		}
		if (!compare.mon_1 && !compare.mon_2) {
			setCompare({ ...compare, mon_1: pokemon });
		}
		if (compare.mon_1 && !compare.mon_2 && compare.mon_1.id !== pokemon.id) {
			setCompare({ ...compare, mon_2: pokemon });
		}
		if (!compare.mon_1 && compare.mon_2 && compare.mon_2.id !== pokemon.id) {
			setCompare({ ...compare, mon_1: pokemon });
		}
		if (compare.mon_1 && compare.mon_2 && compare.mon_1.id !== pokemon.id && compare.mon_2.id !== pokemon.id) {
			setCompare({ ...compare, mon_1: pokemon });
		}
	};
	return (
		<div className="m-5 flex h-fit w-[14rem] flex-col items-center justify-center rounded-2xl bg-neutral-300 bg-opacity-50 px-3 py-2 shadow-xl shadow-neutral-500 backdrop-blur-sm backdrop-filter dark:bg-neutral-500 dark:bg-opacity-50 dark:shadow-neutral-900">
			<div className="mb-1 flex w-full flex-row justify-between">
				{(compare.mon_1 && compare.mon_1.id === pokemon.id) ||
				(compare.mon_2 && compare.mon_2.id === pokemon.id) ? (
					<BiGitCompare
						onClick={(): void => toggleCompare(pokemon)}
						className="h-5 w-5 transform cursor-pointer text-red-700 transition-all duration-300 ease-in-out hover:scale-125"
					/>
				) : (
					<BiGitCompare
						onClick={(): void => toggleCompare(pokemon)}
						className="h-5 w-5 transform cursor-pointer text-blue-700 transition-all duration-300 ease-in-out hover:scale-125"
					/>
				)}
			</div>
			<h1 className="w-11/12 truncate text-center text-xl font-extrabold">{pokemon.name.toLocaleUpperCase()}</h1>
			<div className="Drop-shadow" onClick={(): void => router.push(`/pokemon/${pokemon.id}`)}>
				<Image
					src={String(pokemon.sprites.other?.["official-artwork"].front_default)}
					alt={pokemon.name}
					width={170}
					height={170}
					className="cursor-pointer"
				/>
			</div>
			<div className="mt-1 flex flex-row items-center justify-center space-x-10">
				{pokemon.types.map((type) => (
					<div className="flex flex-col items-center justify-center" key={type.type.name}>
						<Image
							src={`${path}types/${type.type.name}.png`}
							alt={type.type.name}
							width={200}
							height={200}
							className="h-10 w-10 cursor-pointer"
						/>
						<h1 className="text-center text-sm font-bold">{type.type.name.toLocaleUpperCase()}</h1>
					</div>
				))}
			</div>
		</div>
	);
}
