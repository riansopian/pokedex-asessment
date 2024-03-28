/* eslint-disable @typescript-eslint/no-unsafe-call */
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import React from "react";
import { RecoilRoot } from "recoil";

import Footer from "../Footer";

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
}));

describe("Footer component", () => {
	it("should render the Footer component correctly when on a Pokemon page", () => {
		(usePathname as jest.Mock).mockReturnValue("/pokemon/1");

		// Render the component
		render(
			<RecoilRoot>
				<Footer />
			</RecoilRoot>
		);

		// Assert that the component renders correctly
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});
});
