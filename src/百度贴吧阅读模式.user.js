// ==UserScript==
// @name         贴吧阅读器
// @namespace    http://tampermonkey.net/
// @version      0.2
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

    function replaceHiResImages(content) {
        content = content.replace(
            /https?:\/\/imgsa.baidu.com\/forum\/[^\/]+\/sign=[^\/]+\/([0-9a-f]+.jpg)/g,
            "https://imgsrc.baidu.com/forum/pic/item/$1")
        content = content.replace(
            /https?:\/\/tiebapic.baidu.com\/forum\/[^\/]+\/sign=[^\/]+\/([0-9a-f]+.jpg)/g,
            "https://tiebapic.baidu.com/forum/pic/item/$1")
        return content
    }



    function parseContents(contents) {

        let lines = [];

        for (let content of contents) {
            let contentHTML = content.innerHTML
                //alert(contentHTML);
            contentHTML = replaceHiResImages(contentHTML);
            for (let line of contentHTML.split(/<br>/g)) {
                line = processLine(line);
                if (line.length > 0) lines.push(line);
            }
            lines.push("<hr>");
        }

        let processed = _.join(lines, "\n");
        //processed = pangu.spacing(processed)
        return processed;
    }

    function hideText() {
        GM_addStyle(`
.article > p {
    font-size: 0px;
    line-height: 0px;
}
        `)
    }


    function toggleReadMode() {
        let contents = $(".d_post_content");
        let processed = parseContents(contents);
        $("#j_p_postlist").html(`<main class="article-container"><article class="article">${processed}</article></main>`);
        pangu.spacingElementById('j_p_postlist');
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
#toggle-read {
    display: none;
}
        `)
        $(".core_title_btns").append(`<a id="hide-text" class="btn-small btn-sub j_hide_text">隐藏文字</a>`);
        $(".j_hide_text").click(function() {
            hideText()
        })
    }

    $(".core_title_btns").append(`<a id="toggle-read" class="btn-small btn-sub j_read_mode">阅读模式</a>`);
    $(".j_read_mode").click(function() {
        toggleReadMode();
    })

})();