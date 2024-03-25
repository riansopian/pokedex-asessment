import Image from "next/image";
import React from "react";

export const metadata = {
	title: "Login | PokeDex",
	description: "Login to PokeDex.",
};

export default function Login(): React.JSX.Element {
	return (
		<div className="h-screen overflow-hidden bg-black">
			<div className="flex h-full flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center space-y-10">
					<Image src="/logo.png" width={200} height={200} alt={"PokeDex Logo"} />
					<h1 className="text-4xl font-bold text-white">Welcome to PokeDex</h1>
				</div>
			</div>
		</div>
	);
}
