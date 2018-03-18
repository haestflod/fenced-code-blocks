declare var PR: any;

(function () {
    window.addEventListener("load",function () {
        if (!PR) {
            return;
        }


        let parser = new Parser.FencedCodeBlocksParser("prettyprint linenums");

        let commentRoot = document.getElementById("comments");
        let comments = commentRoot.querySelectorAll(".comment-content");

        for (let i = 0; i < comments.length; ++i) {
            let commentElement = comments[i] as HTMLElement;
            parser.createCodeBlocks(commentElement);
        }

        PR.prettyPrint();
    });
})();