/* eslint-disable @typescript-eslint/no-unsafe-call */
import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import React from "react";

import ThemeToggle from "../ThemeToggle";

// Mock useTheme hook
jest.mock("next-themes", () => ({
	useTheme: jest.fn(),
}));

describe("ThemeToggleButton component", () => {
	it("should toggle theme when button is clicked", () => {
		// Mock useTheme hook return values
		const systemTheme = "light";
		const theme = "light";
		const setThemeMock = jest.fn();
		(useTheme as jest.Mock).mockReturnValue({ systemTheme, theme, setTheme: setThemeMock });

		// Render the component
		render(<ThemeToggle />);

		// Act: Simulate a click event on the button
		fireEvent.click(screen.getByRole("button"));

		// Assert: Check if setTheme function is called with the correct theme
		expect(setThemeMock).toHaveBeenCalledWith("dark");
	});
});
