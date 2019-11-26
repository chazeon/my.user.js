// ==UserScript==
// @name         轻之文库阅读模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Chazeon
// @match        *://www.wenku8.net/novel/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.jsdelivr.net/g/lodash
// @require      https://raw.githubusercontent.com/vinta/pangu.js/master/dist/browser/pangu.min.js
// @grant        GM_addStyle
// ==/UserScript==

/* globals $, _, pangu */

GM_addStyle(`
#contentmain {
    max-width: 40em;
    border: none;

}

.locale-zh-Hans .page p {
    text-align: left;
}

body {
    line-height: 2em;
    font-family: -apple-system, BlinkMacSystemFont, PingFang-SC-Regular, "Hiragino Sans GB", "Microsoft Yahei", Arial, sans-serif;
    letter-spacing: 0.03em;
}

#adv1, #adv300, #adv5 {
    display: none;
}

p {
    margin-block-start: 1em;
    margin-block-end: 1em;
}
`)

function transformContent(content) {
    let lines = content.split(/<br>|\n/g);
    console.log(lines);
    lines = _.map(lines, line => line.trim().replace(/^(&nbsp;|\s)+/g, ""))
    lines = _.map(lines, line => line.trim().replace(/^(\d+)$/, '<h2 style="text-align: center">$1<\/h2>'))
    lines = _.filter(lines, line => line !== "")
    lines = _.map(lines, line => "<p>" + line + "</p>")
    content = _.join(lines, "\n")
    content = pangu.spacing(content)
    return content;
}

(function() {
    'use strict';
    let content = transformContent($("#content").html());
    $("#content").html(content);
    pangu.spacingElementById('title');
})();