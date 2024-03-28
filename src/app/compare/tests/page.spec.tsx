/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { render, screen } from "@testing-library/react";
import React from "react";

import Home from "../page";

describe("Home component", () => {
	it("should render the Navbar, CompareContainer, and Footer components", () => {
		render(<Home />);
		const navbarElement = screen.getByRole("navigation");
		const compareContainerElement = screen.getByTestId("compare-container");
		const footerElement = screen.getByTestId("footer");
		expect(navbarElement).toBeInTheDocument();
		expect(compareContainerElement).toBeInTheDocument();
		expect(footerElement).toBeInTheDocument();
	});
});
