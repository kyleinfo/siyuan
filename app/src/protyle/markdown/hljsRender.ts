import {addScript} from "../util/addScript";
import {addStyle} from "../util/addStyle";
import {Constants} from "../../constants";
import {focusByOffset} from "../util/selection";
import {getContenteditableElement} from "../wysiwyg/getBlock";

export const highlightRender = (element: Element, cdn = Constants.PROTYLE_CDN) => {
    let codeElements: NodeListOf<Element>;
    let isPreview = false;
    if (element.classList.contains("code-block")) {
        // 编辑器内代码块编辑渲染
        codeElements = element.querySelectorAll('[spellcheck="false"]');
    } else {
        if (element.classList.contains("item__readme")) {
            // bazaar reademe
            codeElements = element.querySelectorAll("pre code");
            codeElements.forEach(item => {
                item.parentElement.setAttribute("lineNumber", "false");
            });
        } else if (element.classList.contains("b3-typography")) {
            // preview & export html markdown
            codeElements = element.querySelectorAll(".code-block code");
            isPreview = true;
        } else {
            codeElements = element.querySelectorAll('.code-block [spellcheck="false"]');
        }
    }
    if (codeElements.length === 0) {
        return;
    }

    setCodeTheme(cdn);

    addScript(`${cdn}/js/highlight.js/highlight.min.js?v=11.5.0`, "protyleHljsScript").then(() => {
        addScript(`${cdn}/js/highlight.js/third-languages.js?v=1.0.0`, "protyleHljsThirdScript").then(() => {
            codeElements.forEach((block: HTMLElement) => {
                if (block.getAttribute("data-render") === "true") {
                    return;
                }
                const wbrElement = block.querySelector("wbr");
                let startIndex = 0;
                if (wbrElement) {
                    let previousSibling = wbrElement.previousSibling;
                    while (previousSibling) {
                        startIndex += previousSibling.textContent.length;
                        while (!previousSibling.previousSibling && previousSibling.parentElement.tagName !== "DIV") {
                            // 高亮 span 中输入
                            previousSibling = previousSibling.parentElement;
                        }
                        previousSibling = previousSibling.previousSibling;
                    }
                    wbrElement.remove();
                }

                let language;
                if (isPreview) {
                    language = block.parentElement.getAttribute("data-language"); // preview
                } else if (block.previousElementSibling) {
                    language = block.previousElementSibling.firstElementChild.textContent;
                } else {
                    // bazaar readme
                    language = block.className.replace("language-", "");
                }
                if (!hljs.getLanguage(language)) {
                    language = "plaintext";
                }
                block.classList.add("hljs");
                // TODO 等待讨论是否需要渲染 if (!hasClosestByAttribute(block, "id", "searchPreview", true) || isPreview) {
                    block.innerHTML = hljs.highlight(
                        block.textContent + (block.textContent.endsWith("\n") ? "" : "\n"), // https://github.com/siyuan-note/siyuan/issues/4609
                        {
                            language,
                            ignoreIllegals: true
                        }).value;
                // }
                block.setAttribute("data-render", "true");
                const autoEnter = block.parentElement.getAttribute("linewrap");
                const ligatures = block.parentElement.getAttribute("ligatures");
                const lineNumber = block.parentElement.getAttribute("linenumber");
                if (autoEnter === "true" || (autoEnter !== "false" && window.siyuan.config.editor.codeLineWrap)) {
                    block.style.setProperty("white-space", "pre-wrap");
                    block.style.setProperty("word-break", "break-all");
                } else {
                    block.style.setProperty("white-space", "pre",);
                    block.style.setProperty("word-break", "initial",);
                }
                if (ligatures === "true" || (ligatures !== "false" && window.siyuan.config.editor.codeLigatures)) {
                    block.style.fontVariantLigatures = "normal";
                } else {
                    block.style.fontVariantLigatures = "none";
                }
                const languageElement = block.parentElement.querySelector(".protyle-action__language") as HTMLElement;
                if (!isPreview && (lineNumber === "true" || (lineNumber !== "false" && window.siyuan.config.editor.codeSyntaxHighlightLineNum))) {
                    // 需要先添加 class 以防止抖动 https://ld246.com/article/1648116585443
                    block.classList.add("protyle-linenumber");
                    setTimeout(() => {
                        // windows 需等待字体下载完成再计算，否则导致不换行，高度计算错误
                        lineNumberRender(block);
                    }, 20);
                    if (languageElement) {
                        languageElement.style.marginLeft = "3.6em";
                    }
                } else if (block.nextElementSibling?.classList.contains("protyle-linenumber__rows")) {
                    block.classList.remove("protyle-linenumber");
                    block.nextElementSibling.remove();
                    if (languageElement) {
                        languageElement.style.marginLeft = "";
                    }
                }

                if (wbrElement && getSelection().rangeCount > 0) {
                    focusByOffset(block, startIndex, startIndex);
                }
            });
        });
    });
};

export const setCodeTheme = (cdn = Constants.PROTYLE_CDN) => {
    const protyleHljsStyle = document.getElementById("protyleHljsStyle") as HTMLLinkElement;
    let css;
    if (window.siyuan.config.appearance.mode === 0) {
        css = window.siyuan.config.appearance.codeBlockThemeLight;
        if (!Constants.SIYUAN_CONFIG_APPEARANCE_LIGHT_CODE.includes(css)) {
            css = "default";
        }
    } else {
        css = window.siyuan.config.appearance.codeBlockThemeDark;
        if (!Constants.SIYUAN_CONFIG_APPEARANCE_DARK_CODE.includes(css)) {
            css = "github-dark";
        }
    }
    const href = `${cdn}/js/highlight.js/styles/${css}.min.css?v=11.5.0`;
    if (!protyleHljsStyle) {
        addStyle(href, "protyleHljsStyle");
    } else if (!protyleHljsStyle.href.includes(href)) {
        protyleHljsStyle.remove();
        addStyle(href, "protyleHljsStyle");
    }
};

export const lineNumberRender = (block: HTMLElement) => {
    if (block.parentElement.getAttribute("lineNumber") === "false") {
        return;
    }
    if (block.nextElementSibling && block.nextElementSibling.clientHeight === block.clientHeight) {
        return;
    }
    block.classList.add("protyle-linenumber");
    const lineNumberTemp = document.createElement("div");
    lineNumberTemp.className = "hljs protyle-linenumber";
    lineNumberTemp.setAttribute("style", `padding-top:0 !important;padding-bottom:0 !important;min-height:auto !important;white-space:${block.style.whiteSpace};word-break:${block.style.wordBreak};font-variant-ligatures:${block.style.fontVariantLigatures};`);
    lineNumberTemp.setAttribute("contenteditable", "true");
    block.insertAdjacentElement("afterend", lineNumberTemp);

    let lineNumberHTML = "";
    const lineList = block.textContent.split(/\r\n|\r|\n|\u2028|\u2029/g);
    if (lineList[lineList.length - 1] === "" && lineList.length > 1) {
        lineList.pop();
    }
    const isWrap = block.style.wordBreak === "break-all";
    lineList.map((line) => {
        let lineHeight = "";
        if (isWrap) {
            lineNumberTemp.textContent = line || "\n";
            const height = lineNumberTemp.getBoundingClientRect().height;
            lineHeight = ` style="height:${height}px;"`;
        }
        lineNumberHTML += `<span${lineHeight}></span>`;
    });

    lineNumberTemp.remove();
    if (block.nextElementSibling?.classList.contains("protyle-linenumber__rows")) {
        block.nextElementSibling.innerHTML = lineNumberHTML;
    } else {
        block.insertAdjacentHTML("afterend", `<span contenteditable="false" class="protyle-linenumber__rows">${lineNumberHTML}</span>`);
    }
};

export const handleCodeLanguageChange = (nodeElement: HTMLElement) => {
    const editElement = getContenteditableElement(nodeElement);
    const lineNumber = nodeElement.getAttribute("linenumber");
    if (
        lineNumber === "true" ||
        (lineNumber !== "false" &&
            window.siyuan.config.editor.codeSyntaxHighlightLineNum)
    ) {
        editElement.classList.add("protyle-linenumber");
    } else {
        editElement.classList.remove("protyle-linenumber");
    }
    (editElement as HTMLElement).textContent = editElement.textContent;
    editElement.removeAttribute("data-render");
    highlightRender(nodeElement);
};

export const handleCodeSetFold = (nodeElement: Element) => {
    // https://github.com/siyuan-note/siyuan/issues/4411
    nodeElement.querySelectorAll(".protyle-linenumber").forEach((item: HTMLElement) => {
        lineNumberRender(item);
    });
};

export const handleCodeSetPadding = (protyle: IProtyle) => {
    setTimeout(() => { // https://github.com/siyuan-note/siyuan/issues/5612
        protyle.wysiwyg.element.querySelectorAll('.code-block [contenteditable="true"]').forEach((block: HTMLElement) => {
            lineNumberRender(block);
        });
    }, 300);
};

export const ignoreEventInCodeBlock = (
    event:
        | KeyboardEvent
        | ClipboardEvent
        | MouseEvent
        | InputEvent
        | PointerEvent
        | CompositionEvent,
) => {
    return false;
};
