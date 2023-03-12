# SVG Smoother [![Tests](https://github.com/dispossible/svg-smoother/workflows/Tests/badge.svg)](https://github.com/dispossible/svg-smoother/actions/?query=workflow%3ATests)

A utility for adding rounded corners to SVG paths.

Currently only supports hard corners, any pre-existing curve commands are left as is, including corners leading into curve commands. See [examples file](https://htmlpreview.github.io/?https://github.com/dispossible/svg-smoother/blob/main/examples.html) for a demonstration.

## Installation

```
npm i svg-smoother
```

---

## Syntax

### `smoothPath(path, config?)`

Smooths a SVG path string.

#### Parameters

-   `path` A string that matches the SVG `d` spec. [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)
-   `config` An optional [configuration object](#configuration-object)

#### Return value

A `string` matching the SVG `d` spec.

#### Example

```js
import { smoothPath } from "svg-smoother";

const path = smoothPath("M 10 10 L 40 10 L 40 40", { radius: 10 });
```

This function also integrates nicely with React or other frameworks like so:

```jsx
function Path() {
    return <path d={smoothPath("M 10 10 L 40 10 L 40 40")} />;
}
```

---

### `smoothPathElement(element, config?)`

A helper function when working with existing DOM elements.

#### Parameters

-   `element` An SVG Path DOM Element.
-   `config` An optional [configuration object](#configuration-object)

#### Return value

An SVG Path DOM Element.

#### Example

```js
import { smoothPathElement } from "svg-smoother";

const path = document.querySelector("path");
smoothPathElement(path);
```

---

### `smoothPolygon(polygon, config?)`

Takes an array of number pairs and converts it into a smoothed SVG path shape.

This function is particularly helpful if you are using some other JS to generate a path dynamically as a list of x,y pairs that you want to smooth.

#### Parameters

-   `polygon` An array of number pairs (e.g. `[[0, 0], [10, 20], [30, 40]]`) that represent absolute values of a polygon shape. Similar syntax to the CSS [`polygon`](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/polygon) command. Note that the values are not treated as percentages like in CSS but if you provide numbers between 0-100 it does work just the same.
-   `config` An optional [configuration object](#configuration-object)

#### Return value

A `string` matching the SVG `d` spec.

#### Example

```js
import { smoothPolygon } from "svg-smoother";

const path = smoothPolygon([
    [10, 10],
    [40, 10],
    [40, 40],
]);
```

```js
const path = smoothPolygon(
    [
        [10, 10],
        [40, 10],
        [40, 40],
    ],
    {
        closePath: false,
    }
);
```

---

### Configuration object

-   `radius` A number that represents the amount of coordinate points to round the corners by. These values work much like setting CSSs `border-radius` property. Defaults to `10` if not provided

-   `reduceCommands` A boolean that if set to true will attempt to replace any Line commands in the resulting path with Horizontal and Vertical commands to reduce the resulting path length. Defaults to `true` if not provided.

    Turing this off can be helpful if you need a stable set of returned commands for animation states with CSS transitions.

-   `numberAccuracy` Set the number of decimal places to round values to when outputting the new path. Defaults to `3` decimal places if not provided.

-   `closePath` Only applies to the `smoothPolygon` command. A boolean that when set to true closes the provided path into a complete shape. When false it is left open as a line. Defaults to `true` if not provided.

---

## Planned features

-   Deal with radius values that are larger than the preceding line
-   Investigate support for smoothing into and out of curve commands
-   Add more examples
-   Measure and improve performance
-   Add an optimization step to remove large floats, ~~and restore usage of H and V commands~~

---

## Support

Versions of Node >= 14 are tested to work, but testing lower versions is limited because of a testing dependency on JSDOM which has a minimum Node version of 14. SVG Smoother itself is likely to work on older versions than that.

Browser support requires support of [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values#browser_compatibility)

## License

[GNU General Public License](LICENSE)
