# SVG Smoother

A utility for adding rounded corners to SVG paths.

Currently only supports hard corners, any pre-existing curve commands are left as is, including corners leading into curve commands. See [examples file](examples.html) for a demonstration.

## Installation

```
npm i svg-smoother
```

## Usage

There are functions exported from this package;

### smoothPath

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

### smoothPathElement

`smoothPathElement` is a function that is better suited for working on existing DOM elements.

```js
import { smoothPathElement } from "svg-smoother";

const path = document.querySelector("path");
smoothPathElement(path, 10);
```

## Planned features

[] Deal with radius values that are larger than the preceding line
[] Investigate support for smoothing into and out of curve commands
[] Add more examples
[] Measure and improve performance
