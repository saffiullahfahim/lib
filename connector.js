// same line and mid are probably same
// 1st is top and 2nd is bottom
// 1st is bottom and 2nd is top

// prerequirement
// -- 1st be left and 2nd be right

// Work Map
// -- ViewBox and width, height, left, top set on svg
// --

// start again the project

class Connector {
    #viewBox;
    #top;
    #left;
    #path;

    constructor(start, end, append = "There") {
        if (typeof append == "object" && append.constructor.toString().indexOf("HTML") >= 0) {
            let startRects = this.#getRect(start);
            let endRects = this.#getRect(end);

            if (startRects && endRects) {
                const { x: x1 } = startRects;
                const { x: x2 } = endRects;
                if (x1 <= x2) {
                    this.#run(startRects, endRects, append);
                } else {
                    console.error(start, "is not stay on left");
                }
            }
        } else {
            console.error(append, " is not dom element.")
        }
    }

    // get left, top, right, bottom
    #getRect(dom) {
        if (typeof dom == "object" && dom.constructor.toString().indexOf("HTML") >= 0) {
            let rects = {};
            rects.h = dom.offsetHeight;
            rects.w = dom.offsetWidth;
            rects.y = dom.offsetTop;
            rects.x = dom.offsetLeft;
            return rects;
        }
        console.error(dom, " is not a dom element.");
    }

    // run the connector
    #run(start, end, append) {
        const { x: x1, y: y1, h: h1, w: w1 } = start;
        const { x: x2, y: y2, h: h2, w: w2 } = end;

        // top setup
        let x = h2, y;
        if (y1 < y2) {
            this.#top = y1;
            y = h2;
        } else {
            this.#top = y2;
            y = h1;
        }

        // left setup
        this.#left = x1;

        // viewBox Setup
        this.#viewBox = [0, 0, Math.abs(x2 - x1) + x, Math.abs(y1 - y2) + y];

        // create path
        let mid = this.#viewBox[3] / 2;

        console.log(y2, mid, y1)
        if (y1 < y2) {
            if (Math.abs(y1 - y1) <= mid) {
                this.#createPath3(start, end);
            } else {
                this.#createPath1(start, end);
            }
        } else {
            if (Math.abs(y1 - y1) <= mid) {
                this.#createPath4(start, end);
            } else {
                this.#createPath2(start, end);
            }
        }

        // create SVG
        this.#createSVG(append)
    }

    #createSVG(append) {
        let div = document.createElement("div");
        div.innerHTML = `<svg
              viewBox="${this.#viewBox.join(" ")}"
              fill="none"
              style="background: rgba(0, 0, 0, 0.1);position: absolute;left: ${this.#left}; top: ${this.#top}; width: ${this.#viewBox[2]}; height: ${this.#viewBox[3]};"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="${this.#path}"
                fill="transparent"
                stroke-width="4"
                stroke="url(#paint0_linear_614_2853)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_614_2853"
                  x1="0"
                  y1="0"
                  x2="42"
                  y2="206"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E2A6E4" />
                  <stop offset="0.625" stop-color="#A88FE1" />
                  <stop offset="1" stop-color="#7E7FDF" />
                </linearGradient>
              </defs>
            </svg>`
        append.appendChild(div);
    }

    #createPath1(start, end) {
        const { x: x1, y: y1, h: h1, w: w1 } = start;
        const { x: x2, y: y2, h: h2, w: w2 } = end;

        let mid = this.#viewBox[2] / 2;
        let path = `
              M ${w1} ${h1 / 2}
              Q ${mid} ${h1 / 2} ${mid} ${w1}
              L ${mid} ${Math.abs(y1 - y2)}
              Q ${mid} ${Math.abs(y1 - y2) + h2 / 2} ${Math.abs(x1 - x2)} ${Math.abs(y1 - y2) + h2 / 2}
           `;

        this.#path = path;
    }

    #createPath2(start, end) {
        const { x: x1, y: y1, h: h1, w: w1 } = start;
        const { x: x2, y: y2, h: h2, w: w2 } = end;

        let mid = this.#viewBox[2] / 2;
        let path = `
              M ${Math.abs(x1 - x2)} ${h1 / 2}
              Q ${mid} ${h1 / 2} ${mid} ${w1}
              L ${mid} ${Math.abs(y1 - y2)}
              Q ${mid} ${Math.abs(y1 - y2) + h2 / 2} ${w1} ${Math.abs(y1 - y2) + h2 / 2}
           `;

        this.#path = path;
    }

    #createPath3(start, end) {
        const { x: x1, y: y1, h: h1, w: w1 } = start;
        const { x: x2, y: y2, h: h2, w: w2 } = end;

        let mid = this.#viewBox[2] / 2;
        let path = `
              M ${w1} ${h1 / 2}
              Q ${mid} ${h1 / 2} ${Math.abs(x1 - x2)} ${Math.abs(y1 - y2) + h2 / 2}
           `;

        this.#path = path;
    }

    #createPath4(start, end) {
        const { x: x1, y: y1, h: h1, w: w1 } = start;
        const { x: x2, y: y2, h: h2, w: w2 } = end;

        let mid = this.#viewBox[2] / 2;
        let path = `
              M ${Math.abs(x1 - x2)} ${h1 / 2}
              Q ${mid} ${h1 / 2} ${w1} ${Math.abs(y1 - y2) + h2 / 2}
           `;

        this.#path = path;
    }
}
