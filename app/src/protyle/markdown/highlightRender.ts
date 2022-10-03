import {Constants} from "../../constants";
import * as hljsRender from "./hljsRender";
import * as codemirrorRender from "./codemirrorRender";

const enableCodeMirror = Constants.ENABLE_EXPERIMENTAL_CODEMIRROR;

export const highlightRender = (element: Element, cdn = Constants.PROTYLE_CDN) => {
    if (enableCodeMirror) {
        return codemirrorRender.highlightRender(element, cdn);
    }
    return hljsRender.highlightRender(element, cdn);
};

export const setCodeTheme = (cdn = Constants.PROTYLE_CDN) => {
    if (enableCodeMirror) {
        return codemirrorRender.setCodeTheme(cdn);
    }
    return hljsRender.setCodeTheme(cdn);
};

export const lineNumberRender = (block: HTMLElement) => {
    if (enableCodeMirror) {
        return codemirrorRender.lineNumberRender(block);
    }
    return hljsRender.lineNumberRender(block);
};

// 处理 toolbar 中代码块的语言类型的变化，包括点击和输入造成的变化
export const handleCodeLanguageChange = (nodeElement: HTMLElement) => {
    if (enableCodeMirror) {
        return codemirrorRender.handleCodeLanguageChange(nodeElement);
    }
    return hljsRender.handleCodeLanguageChange(nodeElement);
};

// 处理 protyle.ts 的 setFold 的逻辑
export const handleCodeSetFold = (nodeElement: Element) => {
    if (enableCodeMirror) {
        return codemirrorRender.handleCodeSetFold(nodeElement);
    }
    return hljsRender.handleCodeSetFold(nodeElement);
};

// 处理 initUI.ts 的 setPadding 的逻辑
export const handleCodeSetPadding = (protyle: IProtyle) => {
    if (enableCodeMirror) {
        return codemirrorRender.handleCodeSetPadding(protyle);
    }
    return hljsRender.handleCodeSetPadding(protyle);
};

// 是否过滤代码块内部的事件
export const ignoreEventInCodeBlock = (
    event:
        | KeyboardEvent
        | ClipboardEvent
        | MouseEvent
        | InputEvent
        | PointerEvent
        | CompositionEvent,
) => {
    if (enableCodeMirror) {
        return codemirrorRender.ignoreEventInCodeBlock(event);
    }
    return hljsRender.ignoreEventInCodeBlock(event);
};
