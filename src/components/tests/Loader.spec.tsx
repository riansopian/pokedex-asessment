/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { render } from "@testing-library/react";
import React from "react";
import { RecoilRoot } from "recoil";

import Loader from "../Loader";

// Mock next/image component
jest.mock("next/image", () => ({
	__esModule: true,
	default: () => <img />,
}));

describe("Loader component", () => {
	it("should render Loader component correctly", () => {
		render(
			<RecoilRoot>
				<Loader />
			</RecoilRoot>
		);
	});
});
