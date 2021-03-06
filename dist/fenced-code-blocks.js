(function () {
    window.addEventListener("load", function () {
        if (!PR) {
            return;
        }
        var parser = new Parser.FencedCodeBlocksParser("prettyprint linenums");
        var commentRoot = document.getElementById("comments");
        var comments = commentRoot.querySelectorAll(".comment-content");
        for (var i = 0; i < comments.length; ++i) {
            var commentElement = comments[i];
            parser.createCodeBlocks(commentElement);
        }
        PR.prettyPrint();
    });
})();
var Parser;
(function (Parser) {
    var FencedCodeBlocksParser = /** @class */ (function () {
        function FencedCodeBlocksParser(codeClassNames) {
            this.preClassNames = codeClassNames;
        }
        // This code is based off the https://github.com/jonschlinkert/gfm-code-blocks/ repository
        /**
         *
         * @param {string} text
         * @return {any[]}
         */
        FencedCodeBlocksParser.prototype.parse = function (text) {
            // Original regex
            //const regex = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm;
            // Modified regex that doesn't need linebreaks.
            // This however makes it unable to use
            // ```js
            // code
            /// ```
            var regex = /(([ \t]*`{3,4})([\s\S]+?)([ \t]*\2))/gm;
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
        };
        FencedCodeBlocksParser.prototype.createCodeBlocks = function (element) {
            var html = element.innerHTML;
            var nodeName = element.nodeName;
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
            var blocks = this.parse(html);
            // If after parsing no blocks were found then also return early
            if (blocks.length === 0) {
                return;
            }
            var documentFragment = document.createDocumentFragment();
            for (var i = 0; i < blocks.length; i++) {
                var currentBlock = blocks[i];
                var nextBlock = blocks[i + 1];
                var blockElement = this.createCodeBlock(html, currentBlock);
                var nextChildElement = this.createChildElement(html, nodeName, currentBlock, nextBlock);
                documentFragment.appendChild(blockElement);
                if (nextChildElement) {
                    documentFragment.appendChild(nextChildElement);
                }
            }
            element.innerHTML = html.substring(0, blocks[0].start);
            element.parentElement.insertBefore(documentFragment, element.nextSibling);
        };
        FencedCodeBlocksParser.prototype.createCodeBlock = function (html, block) {
            // Change <br> to \n
            var preElement = document.createElement("pre");
            var codeElement = document.createElement("code");
            if (this.preClassNames !== "") {
                preElement.className = this.preClassNames;
            }
            codeElement.innerHTML = block.code;
            preElement.appendChild(codeElement);
            return preElement;
        };
        FencedCodeBlocksParser.prototype.createChildElement = function (html, nodeName, startBlock, endBlock) {
            var start = startBlock.end;
            var end = endBlock ? endBlock.start : html.length;
            if (start === end) {
                return null;
            }
            var part = html.substring(start, end);
            var newElement = document.createElement(nodeName);
            newElement.innerHTML = part;
            // TODO: Copy classes?
            return newElement;
        };
        return FencedCodeBlocksParser;
    }());
    Parser.FencedCodeBlocksParser = FencedCodeBlocksParser;
})(Parser || (Parser = {}));
//# sourceMappingURL=fenced-code-blocks.js.map