/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { render, screen } from "@testing-library/react";
import React from "react";
import { RecoilRoot } from "recoil";

import { BackgroundAtom } from "@/components/atoms/backgroundAtom";

import BackGround from "../Background";

describe("BackGround component", () => {
	it("should set a random background image when mounted", () => {
		render(
			<RecoilRoot>
				<BackGround />
			</RecoilRoot>
		);

		setTimeout(() => {
			const image = screen.getByAltText("Background");
			expect(image).toHaveAttribute("src", expect.stringMatching(/\/backgrounds\/.*\.jpg/));
		}, 1000); // Adjust the timeout as needed
	});

	it("should render the correct background image", () => {
		const initialState = "test.jpg";
		render(
			<RecoilRoot initializeState={(snap) => snap.set(BackgroundAtom, initialState)}>
				<BackGround />
			</RecoilRoot>
		);
		setTimeout(() => {
			const image = screen.getByAltText("Background");
			expect(image).toHaveAttribute("src", `/backgrounds/${initialState}`);
		}, 1000); // Adjust the timeout as needed
	});
});
