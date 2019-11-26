// ==UserScript==
// @name         贴吧阅读器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Chazeon
// @match        *://tieba.baidu.com/p/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.jsdelivr.net/g/lodash
// @require      https://raw.githubusercontent.com/vinta/pangu.js/master/dist/browser/pangu.min.js
// @grant        GM_addStyle
// ==/UserScript==

/* globals $, _, pangu */

(function() {
    'use strict';

    function processLine(line) {
        line = line.trim().replace(/^(&nbsp;|\s)+/g, "");
        line = "<p>" + line + "</p>";
        return line;
    }

    function parseContents(contents) {

        let lines = []

        for (let content of contents) {
            for (let line of content.innerHTML.split(/<br>|\n/g)) {
                line = processLine(line);
                if (line.length > 0) lines.push(line);
            }
            lines.push("<hr>");
        }

        let processed = _.join(lines, "\n");
        processed = pangu.spacing(processed)
        return processed;
    }


    function toggleReadMode() {
        let contents = $(".d_post_content");
        let processed = parseContents(contents);
        $("#j_p_postlist").html(`<main class="article-container"><article class="article">${processed}</article></main>`);
        $(".right_section").html('');
        $('#toggle-read').addClass('btn-disabled');
        GM_addStyle(`
.article-container {
    padding: 20px;
    background-color: #fff
}
.article {
    max-width: 30em;
    font-size: 16px;
    line-height: 1.6em;
    font-family: -apple-system, BlinkMacSystemFont, PingFang-SC-Regular, "Hiragino Sans GB", "Microsoft Yahei", Arial, sans-serif;
    letter-spacing: 0.04em;
    margin: auto;
}
.article > p {
    margin-block-start: 0.8em;
    margin-block-end: 0.8em;
}
hr {
   border: 0;
    height: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    margin-block-start: 1em;
    margin-block-end: 1em;
}
        `)
    }

    $(".core_title_btns").append(`<a id="toggle-read" class="btn-small btn-sub j_read_mode">阅读模式</a>`);
    $(".j_read_mode").click(function() {
        toggleReadMode();
    })

})();