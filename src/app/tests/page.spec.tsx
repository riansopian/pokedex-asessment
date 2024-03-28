/* eslint-disable @typescript-eslint/no-unsafe-call */
import { render, screen } from "@testing-library/react";
import React from "react";
import { RecoilRoot } from "recoil";

import Home, { generateMetadata } from "../page";

// Mock the Image component
jest.mock("next/image", () => ({
	__esModule: true,
	default: () => <img />,
}));

// Mock the generateMetadata function
jest.mock("../page", () => ({
	__esModule: true,
	default: jest.fn(),
	generateMetadata: jest.fn(),
}));

describe("Home component", () => {
	beforeEach(() => {
		// Reset mock implementations before each test
		jest.clearAllMocks();
	});

	it("renders Navbar, Background, Footer, and other elements correctly", () => {
		render(
			<RecoilRoot>
				<Home />
			</RecoilRoot>
		);

		expect(screen.getByRole("navigation")).toBeInTheDocument();

		expect(screen.getByTestId("compare-container")).toBeInTheDocument();

		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	it("calls generateMetadata function", async () => {
		await generateMetadata();
		expect(generateMetadata).toHaveBeenCalled();
	});
});
