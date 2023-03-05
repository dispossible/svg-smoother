# SVG Smoother ![Tests](https://github.com/dispossible/svg-smoother/workflows/Tests/badge.svg)

A utility for adding rounded corners to SVG paths.

Currently only supports hard corners, any pre-existing curve commands are left as is, including corners leading into curve commands. See [examples file](https://htmlpreview.github.io/?https://github.com/dispossible/svg-smoother/blob/main/examples.html) for a demonstration.

## Installation

```
npm i svg-smoother
```

## Usage

There are functions exported from this package;

### `smoothPath`

The `smoothPath` command takes in a string matching the SVG `d` syntax. [MDN]](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)

The second argument is a value representing the amount of coordinate points to round the corners by. Values work much like CSSs `border-radius` values.

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

## Planned features

-   Deal with radius values that are larger than the preceding line
-   Investigate support for smoothing into and out of curve commands
-   Add more examples
-   Measure and improve performance
-   Add an optimization step to remove large floats, and restore usage of H and V commands

## Support

Versions of Node >= 14 are tested to work, but testing is limited because of a dependency on JSDOM in my tests which is Node >= 14. SVG Smoother itself is likely to work on older versions than that.

Browser support requires support of [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values#browser_compatibility)

## License

[GNU General Public License](LICENSE)
