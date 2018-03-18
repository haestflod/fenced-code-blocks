module Parser {
    // From the github:
    /*
    start: 6,
    end: 30
    lang: 'js',
    code: 'var qux = 123;',
    block: '```js\nvar qux = 123;\n```',
    */
    export interface IBlock {
        start: number;
        end: number;
        code: string;
    }

    export class FencedCodeBlocksParser {

        private preClassNames: string;

        constructor (codeClassNames: string) {
            this.preClassNames = codeClassNames;
        }

        // This code is based off the https://github.com/jonschlinkert/gfm-code-blocks/ repository
        /**
         *
         * @param {string} text
         * @return {any[]}
         */
        public parse(text: string): IBlock[] {
            // Original regex
            //const regex = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm;
            // Modified regex that doesn't need linebreaks.
            // This however makes it unable to use
            // ```js
            // code
            /// ```
            const regex = /(([ \t]*`{3,4})([\s\S]+?)([ \t]*\2))/gm;
            if (!text || !text.length) {
                return;
            }

            var blocks = [];
            var match = null;

            while ((match = regex.exec(text))) {
                blocks.push({
                  start: match.index,
                  end: match.index + match[1].length,
                  code: match[3],
                });
            }

            return blocks;
        }

        public createCodeBlocks (element: HTMLElement) {
            const html = element.innerHTML;
            const nodeName = element.nodeName;

            // For example:
            // Input: <p>text 1 ```code1``` text2 ```code2``` text 3</p>
            // Output
            /*
                <p>text1</p>
                <pre><code>code1</code</pre>
                <p>text2<p>
                <pre><code>code2</code></pre>
                <p>text3</p>
             */
            // If no fenced code blocks are found then just return early
            if (html.indexOf("```") === -1) {
                return;
            }

            const blocks = this.parse(html);
            // If after parsing no blocks were found then also return early
            if (blocks.length === 0) {
                return;
            }

            let documentFragment = document.createDocumentFragment();

            for (let i = 0; i < blocks.length; i++) {
                const currentBlock = blocks[i];
                const nextBlock = blocks[i +1];

                let blockElement = this.createCodeBlock(html, currentBlock);
                let nextChildElement = this.createChildElement(html, nodeName, currentBlock, nextBlock);

                documentFragment.appendChild(blockElement);

                if (nextChildElement) {
                    documentFragment.appendChild(nextChildElement);
                }
            }

            element.innerHTML = html.substring(0, blocks[0].start);

            element.parentElement.insertBefore(documentFragment, element.nextSibling);
        }

        private createCodeBlock(html, block): HTMLPreElement {
            // Change <br> to \n
            let preElement: HTMLPreElement = document.createElement("pre");
            let codeElement: HTMLElement = document.createElement("code");

            if (this.preClassNames !== "") {
                preElement.className = this.preClassNames;
            }

            codeElement.innerHTML = block.code;

            preElement.appendChild(codeElement);

            return preElement;
        }

        private createChildElement(html, nodeName, startBlock: IBlock, endBlock: IBlock): HTMLElement {
            const start = startBlock.end;
            const end = endBlock ? endBlock.start : html.length;

            if (start === end) {
                return null;
            }

            const part = html.substring(start, end);
            let newElement: HTMLElement = document.createElement(nodeName);
            newElement.innerHTML = part;
            // TODO: Copy classes?

            return newElement;
        }
    }
}