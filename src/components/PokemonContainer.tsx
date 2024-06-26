/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import Image from "next/image";
import { notFound } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import ColorThief from "node_modules/colorthief/dist/color-thief.mjs";
import {
	EvolutionChain,
	EvolutionClient,
	// ItemClient,
	MoveClient,
	Pokemon,
	PokemonClient,
	PokemonSpecies,
} from "pokenode-ts";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useRecoilState } from "recoil";

import { accentColor, accentColors } from "@/components/atoms/accentColor";
import { pokemonPage } from "@/components/atoms/pokemonPage";
import PokemonCard from "@/components/PokemonCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomMove } from "@/lib/models";
import { getDescription, getPokemon } from "@/lib/utils";

export default function PokemonContainer({ params }: { params: { slug: string } }): React.JSX.Element {
	const [pokemon, setPokemon] = useState<Pokemon>();
	const [species, setSpecies] = useState<PokemonSpecies>();
	const [description, setDescription] = useState<string>();
	const [moves, setMoves] = useState<CustomMove[]>([]);
	const [page, setPage] = useRecoilState(pokemonPage);
	const [evolutions, setEvolutions] = useState<EvolutionChain>();
	const [evolutionList, setEvolutionList] = useState<number[]>();
	const [evolutionMons, setEvolutionMons] = useState<Pokemon[]>([]);
	const [color, setColor] = useRecoilState(accentColor);
	const [locations, setLocations] = React.useState<string[]>([]);
	// const [berries, setBerries] = useState<any[]>([]);

	// useEffect(() => {
	// 	const fetchBerries = async (): Promise<void> => {
	// 		try {
	// 			const itemClient = new ItemClient();
	// 			const allBerries = [];
	// 			for (let berryId = 1; berryId <= 64; berryId++) {
	// 				const berry = await itemClient.getItemById(berryId);
	// 				allBerries.push(berry);
	// 			}
	// 			setBerries(allBerries);
	// 		} catch (error) {
	// 			console.error("Error fetching berries:", error);
	// 		}
	// 	};
	// 	void fetchBerries();
	// }, []);

	useEffect(() => {
		async function getMon(): Promise<void> {
			try {
				const mon = await getPokemon({ params });
				setPokemon(mon);
			} catch (e) {
				console.log("Not found");
				notFound();
			}
		}
		void getMon();
	}, [params]);
	useEffect(() => {
		if (pokemon) {
			const api = new PokemonClient();
			void api.getPokemonSpeciesById(parseInt(pokemon.species.url.split("/")[6])).then((res) => setSpecies(res));
		}
	}, [pokemon]);
	useEffect(() => {
		if (species) {
			setDescription(getDescription(species));
		}
	}, [species]);
	useEffect(() => {
		if (pokemon) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
			const thief = new ColorThief();
			const img = document.createElement("img");
			img.src = String(pokemon.sprites.other?.home.front_default ?? pokemon.sprites.front_default);
			img.crossOrigin = "Anonymous";
			img.onload = (): void => {
				try {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
					const colors = thief.getPalette(img) as [number, number, number][];
					const darkColors = colors.filter((color) => color[0] + color[1] + color[2] < 600);
					const color = darkColors[Math.floor(Math.random() * darkColors.length)];
					setColor({
						color: "text-white",
						background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
						border: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
					});
				} catch (e) {
					setColor(accentColors[pokemon.types[Math.floor(Math.random() * pokemon.types.length)].type.name]);
				}
			};
		}
	}, [pokemon]);
	useEffect(() => {
		async function getMoves(): Promise<void> {
			const api = new MoveClient();
			const moves = await Promise.all(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				pokemon.moves.map(async (move): Promise<CustomMove | undefined> => {
					const details = move.version_group_details[move.version_group_details.length - 1];
					try {
						const res = await api.getMoveByName(move.move.name);
						return {
							...res,
							move_learn_method: details.move_learn_method.name,
							level_learned_at: details.level_learned_at,
						};
					} catch {
						return undefined;
					}
				})
			);
			setMoves(moves.filter((move): move is CustomMove => move !== undefined));
		}
		if (pokemon) {
			void getMoves();
		}
	}, [pokemon]);
	useEffect(() => {
		async function getEvolutions(): Promise<void> {
			if (!pokemon || !species) return;
			const api = new EvolutionClient();
			try {
				const chain = await api.getEvolutionChainById(parseInt(species.evolution_chain.url.split("/")[6]));
				setEvolutions(chain);
			} catch (e) {
				console.log(e);
			}
		}
		if (pokemon) {
			void getEvolutions();
		}
	}, [pokemon, species]);
	useEffect(() => {
		if (evolutions) {
			const evolutionChain: number[] = [];
			let currentEvolutions = [evolutions.chain];
			while (currentEvolutions.length > 0) {
				const nextEvolutions = [];
				for (const evolution of currentEvolutions) {
					evolutionChain.push(parseInt(evolution.species.url.split("/")[6]));
					if (evolution.evolves_to.length > 0) {
						nextEvolutions.push(...evolution.evolves_to);
					}
				}
				currentEvolutions = nextEvolutions;
			}
			setEvolutionList(evolutionChain);
		}
	}, [evolutions]);
	useEffect(() => {
		async function getPokemonData(): Promise<void> {
			if (!evolutionList || evolutionList.length === 0) return;
			const api = new PokemonClient();
			const _pokemonData = await Promise.all(evolutionList.map((pokemon) => api.getPokemonById(pokemon)));
			setEvolutionMons(_pokemonData);
		}
		void getPokemonData();
	}, [evolutionList]);
	useEffect(() => {
		async function getLocations(): Promise<void> {
			if (!species) return;
			const api = new PokemonClient();
			const locations = await api.getPokemonLocationAreaById(species.id);
			setLocations(locations.map((location) => location.location_area.name));
		}
		void getLocations();
	}, [pokemon, species]);
	return (
		<div className="flex h-full w-full flex-col border-x bg-gray-500 bg-opacity-20 backdrop-blur-sm backdrop-filter dark:bg-gray-800 dark:bg-opacity-20">
			{pokemon && species && page === "Description" && (
				<div className="flex h-[80vh] w-full flex-grow flex-col overflow-x-hidden overflow-y-scroll scrollbar-hide xl:flex-row">
					<div className="flex w-full flex-grow flex-col space-y-5 xl:space-y-0">
						<div
							className="m-3 h-fit w-[16rem] space-y-3 rounded-md border-l-4 bg-gray-200 bg-opacity-20 p-3 backdrop-blur-sm backdrop-filter dark:bg-gray-800 dark:bg-opacity-20 sm:w-[20rem]"
							style={{ borderColor: color.border }}>
							<h1 className="flex flex-row items-end text-3xl font-bold capitalize">
								{pokemon.name}
								<p className="text-xl">#{pokemon.id.toString().padStart(3, "0")}</p>
							</h1>
							<div className="flex flex-row items-center space-x-2 sm:space-x-10">
								{pokemon.types.map((type) => (
									<div
										className="flex flex-col items-center justify-center space-y-1"
										key={type.type.name}>
										<div className="flex h-12 w-12 items-center justify-center rounded-full">
											<Image
												src={`/types/${type.type.name}.png`}
												width={32}
												height={32}
												alt={type.type.name}
												className="h-full w-full"
											/>
										</div>
										<p className="capitalize">{type.type.name}</p>
									</div>
								))}
							</div>
							<button
								className="absolute -bottom-3 -right-5 h-10 w-1/2 rounded-md border-2 backdrop-blur-sm backdrop-filter transition-all duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-800 dark:bg-opacity-20 dark:hover:bg-gray-800"
								style={{ borderColor: color.border }}
								onClick={(): void => setPage("Evolutions")}>
								<p className="md:text-md text-sm">SEE EVOLUTIONS</p>
							</button>
						</div>
						<div className="ml-3 flex h-full w-full flex-col justify-center space-y-3 xl:mt-0">
							{pokemon.stats.map((stat) => (
								<div className="flex flex-row items-center space-x-2 text-right" key={stat.stat.name}>
									<p className="w-[4rem] text-sm sm:w-[8rem]">{stat.stat.name.toLocaleUpperCase()}</p>
									<div className="h-3 w-[10rem] rounded-full bg-gray-200 bg-opacity-40 backdrop-blur-sm backdrop-filter dark:bg-gray-700 dark:bg-opacity-40 sm:w-[15rem]">
										<div
											className="h-3 rounded-full bg-opacity-20 dark:bg-opacity-20"
											style={{
												width: `${(stat.base_stat / 255) * 100}%`,
												backgroundColor: color.border,
											}}></div>
									</div>
									<p className="w-[2rem]">{stat.base_stat}</p>
								</div>
							))}
							{/* <div className="pokemon-container overflow-auto">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
									{berries.map((berry: { name: string; sprites: { default?: string } }) => (
										<div className="berry-info" key={berry.name}>
											<h2>{berry.name}</h2>
											{berry.sprites.default && (
												<Image
													src={berry.sprites.default}
													alt={berry.name}
													width={50}
													height={50}
												/>
											)}
										</div>
									))}
								</div>
								<button>Feed Pokemon</button>
							</div> */}
						</div>
					</div>
					<div className="m-[3rem] flex justify-center" style={{ borderColor: color.border }}>
						<div
							className="relative flex h-full w-full items-center justify-center rounded-full border-[0.2rem] sm:h-[24rem] sm:w-[24rem]"
							style={{ borderColor: color.border }}>
							<div
								className="m-2 flex h-[16rem] w-[16rem] items-center justify-center rounded-full border-[0.3rem] sm:m-0 sm:h-[20rem] sm:w-[20rem]"
								style={{ borderColor: color.border }}>
								<div className="items-center justify-center">
									<Carousel
										showArrows={false}
										showStatus={false}
										infiniteLoop={true}
										autoPlay={true}
										interval={5000}
										emulateTouch={true}>
										<Image
											src={
												// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
												String(pokemon.sprites.other?.["official-artwork"]?.front_default) ??
												pokemon.sprites.front_default
											}
											width={50}
											height={50}
											alt={pokemon.name}
											className="z-10 mx-auto block"
										/>
										<Image
											src={
												// eslint-disable-next-line @typescript-eslint/ban-ts-comment
												// @ts-expect-error
												// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
												String(pokemon.sprites.other?.["official-artwork"]?.front_shiny) ??
												pokemon.sprites.front_shiny
											}
											width={50}
											height={50}
											alt={pokemon.name}
											className="z-10 mx-auto block"
										/>
									</Carousel>
								</div>
								<div className="absolute -z-10 flex gap-[3rem]">
									<div
										className="h-[20rem] w-[0.3rem] rotate-45 sm:h-[28rem]"
										style={{ backgroundColor: color.border }}></div>
									<div
										className="h-[20rem] w-[0.3rem] rotate-45 sm:h-[28rem]"
										style={{ backgroundColor: color.border }}></div>
								</div>
							</div>
						</div>
					</div>
					<div className="m-3 flex w-fit flex-grow flex-col self-end text-center xl:w-full">
						<div
							className="h-fit w-fit space-y-3 rounded-md border-r-4 bg-gray-200 bg-opacity-20 p-3 backdrop-blur-sm backdrop-filter dark:bg-gray-800 dark:bg-opacity-20 xl:w-full"
							style={{ borderColor: color.border }}>
							<h1 className="text-2xl font-bold">DESCRIPTION</h1>
							<p className="text-md">{description}</p>
						</div>
					</div>
				</div>
			)}
			{Boolean(moves.length) && page === "Moves" && (
				<div className="flex h-[80vh] w-full flex-wrap overflow-auto scrollbar-hide">
					<Table>
						<TableHeader className="text-center text-sm sm:text-xl">
							<TableRow className="bg-gray-200 bg-opacity-40 backdrop-blur-sm backdrop-filter dark:bg-gray-800 dark:bg-opacity-40">
								<TableHead className="text-center">Move</TableHead>
								<TableHead className="text-center">Type</TableHead>
								<TableHead className="text-center">Category</TableHead>
								<TableHead className="text-center">Accuracy</TableHead>
								<TableHead className="text-center">Power</TableHead>
								<TableHead className="text-center">Method</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="text-center">
							{moves.map((move) => (
								<TableRow key={move.name}>
									<TableCell className="sm:text-md sm:font-medium">
										{move.name.toLocaleUpperCase()}
									</TableCell>
									<TableCell>
										<Image
											src={`/types/${move.type.name}.png`}
											width={32}
											height={32}
											alt="type"
											className="mx-auto block h-4 w-4 sm:h-8 sm:w-8"
										/>
									</TableCell>
									<TableCell>
										<Image
											// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
											src={`/moves/${move.damage_class?.name}.png`}
											width={32}
											height={32}
											alt="category"
											className="mx-auto block h-4 w-4 sm:h-8 sm:w-8"
										/>
									</TableCell>
									<TableCell>{move.accuracy ?? "—"}</TableCell>
									<TableCell>{move.power ?? "—"}</TableCell>
									<TableCell>
										{move.level_learned_at
											? `Lv ${move.level_learned_at}`
											: move.move_learn_method === "machine"
											? "Machine"
											: "Egg Move"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
			{Boolean(evolutionMons.length) && page === "Evolutions" && (
				<div className="flex h-[80vh] flex-wrap justify-center overflow-y-scroll scrollbar-hide">
					{evolutionMons.map((mon) => (
						<div onClick={(): void => setPage("Description")}>
							<PokemonCard pokemon={mon} path={"/"} key={mon.id} />
						</div>
					))}
				</div>
			)}
			{Boolean(locations.length) && page === "Encounter Areas" && (
				<div className="flex h-[80vh] flex-wrap justify-center overflow-y-scroll scrollbar-hide">
					{locations.map((location) => (
						<div
							key={location}
							style={{ borderColor: color.border }}
							className={`m-5 flex h-28 w-[18rem] cursor-pointer flex-row items-center justify-center space-x-5 rounded-lg border-2 bg-gray-200 bg-opacity-40 px-2 backdrop-blur-sm backdrop-filter transition duration-300 ease-in-out hover:bg-gray-200 hover:bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-40 dark:hover:bg-gray-800 dark:hover:bg-opacity-60`}>
							<Image
								src={pokemon?.sprites.front_default ?? "/pokeball.png"}
								width={64}
								height={64}
								alt="pokemon"
								className="h-16 w-16 sm:h-28 sm:w-28"
							/>
							<p className="text-sm">{location.split("-").join(" ").toLocaleUpperCase()}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
