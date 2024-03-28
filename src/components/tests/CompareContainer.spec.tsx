/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { render } from "@testing-library/react";
import React from "react";
import { RecoilRoot } from "recoil";

import CompareContainer from "../CompareContainer";

describe("CompareContainer component", () => {
	it("should render CompareContainer component correctly", () => {
		render(
			<RecoilRoot>
				<CompareContainer />
			</RecoilRoot>
		);
	});
});
