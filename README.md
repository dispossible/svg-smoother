# SVG Smoother [![Tests](https://github.com/dispossible/svg-smoother/workflows/Tests/badge.svg)](https://github.com/dispossible/svg-smoother/actions/?query=workflow%3ATests)

A utility for adding rounded corners to SVG paths.

Currently only supports hard corners, any pre-existing curve commands are left as is, including corners leading into curve commands. See [examples file](https://htmlpreview.github.io/?https://github.com/dispossible/svg-smoother/blob/main/examples.html) for a demonstration.

## Installation

```
npm i svg-smoother
```

## Usage

There are several functions exported from this package;

### `smoothPath`

The `smoothPath` command takes in a string matching the SVG `d` syntax. [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)

The second argument is a value representing the amount of coordinate points to round the corners by. These values work much like setting CSSs `border-radius` property.

```js
import { smoothPath } from "svg-smoother";

const path = smoothPath("M 10 10 L 40 10 L 40 40", 10);
```

This function also integrates nicely with React or other frameworks like so:

```jsx
import { smoothPath } from "svg-smoother";

function Path() {
    return <path d={smoothPath("M 10 10 L 40 10 L 40 40", 10)} />;
}
```

### `smoothPathElement`

The `smoothPathElement` function is better suited for working with existing DOM elements.

```js
import { smoothPathElement } from "svg-smoother";

const path = document.querySelector("path");
smoothPathElement(path, 10);
```

### `smoothPolygon`

The `smoothPolygon` function will take a array of number pairs (`[number, number][]`) and convert it into a smoothed SVG path string.

```js
import { smoothPolygon } from "svg-smoother";

const path = smoothPolygon(
    [
        [10, 10],
        [40, 10],
        [40, 40],
    ],
    10
);
```

This function was designed to work with a similar syntax to the CSS [`polygon`](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/polygon) command. Note that the values are not treated as percentages like in CSS but if you provide numbers between 0-100 it does work just the same.

This function is particularly helpful if you are using some other JS to generate a path dynamically as a list of x,y pairs that you want to smooth.

The 3rd argument for this function is an option to close the polygon. i.e. create a smoothed line, rather than a complete shape. Which is true (closed) by default.

```js
// Will end with a Z
const path = smoothPolygon(
    [
        [10, 10],
        [40, 10],
        [40, 40],
    ],
    10,
    true
);

// Will NOT end with a Z
const path = smoothPolygon(
    [
        [10, 10],
        [40, 10],
        [40, 40],
    ],
    10,
    false
);
```

## Planned features

-   Deal with radius values that are larger than the preceding line
-   Investigate support for smoothing into and out of curve commands
-   Add more examples
-   Measure and improve performance
-   Add an optimization step to remove large floats, ~~and restore usage of H and V commands~~

## Support

Versions of Node >= 14 are tested to work, but testing lower versions is limited because of a testing dependency on JSDOM which has a minimum Node version of 14. SVG Smoother itself is likely to work on older versions than that.

Browser support requires support of [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values#browser_compatibility)

## License

[GNU General Public License](LICENSE)
