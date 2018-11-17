# fenced-code-blocks

This code is based off the code from [Jon Schlinkert]((https://github.com/jonschlinkert)).
The 2 repositories that the code is from: 
* https://github.com/regexhq/gfm-code-block-regex
* https://github.com/jonschlinkert/gfm-code-blocks

**Note: If you're copy-pasting the ´´´ characters from here they are the wrong characters!**  

The parser was written mainly for writing the ´´´code´´´ approach for blogger comments. 
So it's not a completely generic solution.

parser.ts 
<br>
The function `createCodeBlocks(element)` takes an element and checks it for ´´´ appearances. 
If it finds any it will wrap the html between ´´´html´´´ inside a `<pre><code>html</code></pre>` block.
Then continue by adding the remaining html in whatever the input element's nodeName was. 
So a `<p>` will continue being a `<p>`tag 

For example:
```
Input: <p id="moo">text 1 ```code1``` text2 ```code2``` text 3</p>
Output:
/*
    <p id="moo">text1</p>
    <pre><code>code1</code</pre>
    <p>text2<p>
    <pre><code>code2</code></pre>
    <p>text3</p>
 */
```

There's no support for single blocks `´html´` currently which would be wrapped only as `<code>html</code>`

 
