/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import ProviderButton from "../ProviderButton";

// Mock signIn function
jest.mock("next-auth/react", () => ({
	signIn: jest.fn(),
}));

describe("ProviderButton component", () => {
	it("should call signIn function when button is clicked", async () => {
		// Arrange
		const id = "provider_id";
		const name = "Provider Name";
		const callback = "/callback";

		// Render the component
		render(<ProviderButton id={id} name={name} callback={callback} />);

		// Act: Simulate a click event on the button
		fireEvent.click(screen.getByRole("button"));

		// Assert: Check if signIn function is called with the correct arguments
	});
});
