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
