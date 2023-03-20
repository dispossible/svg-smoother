import "mocha";
import { expect } from "chai";

import { defaultConfig, defaultPolygonConfig } from "./config";

describe("Configs", () => {
    it("Can get the default config", () => {
        expect(defaultConfig()).to.deep.equal({
            radius: 10,
            reduceCommands: true,
            numberAccuracy: 3,
            preventOverflow: true,
            allowEllipse: true,
        });
    });

    it("Can get polygon config", () => {
        expect(defaultPolygonConfig()).to.deep.equal({
            radius: 10,
            reduceCommands: true,
            numberAccuracy: 3,
            preventOverflow: true,
            allowEllipse: true,
            closePath: true,
        });
    });

    it("Can set partial configs", () => {
        expect(
            defaultConfig({
                radius: 30,
                preventOverflow: false,
            })
        ).to.deep.equal({
            radius: 30,
            reduceCommands: true,
            numberAccuracy: 3,
            preventOverflow: false,
            allowEllipse: true,
        });
        expect(
            defaultConfig({
                reduceCommands: true,
                numberAccuracy: 7,
                allowEllipse: false,
            })
        ).to.deep.equal({
            radius: 10,
            reduceCommands: true,
            numberAccuracy: 7,
            preventOverflow: true,
            allowEllipse: false,
        });
    });
});
