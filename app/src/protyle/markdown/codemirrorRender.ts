import { addScript } from "../util/addScript";
import { addStyle } from "../util/addStyle";
import { Constants } from "../../constants";

export const highlightRender = (
    element: Element,
    cdn = Constants.PROTYLE_CDN,
) => {
    return;
};

export const setCodeTheme = (cdn = Constants.PROTYLE_CDN) => {
    return;
};

export const lineNumberRender = (block: HTMLElement) => {
    return;
};

export const handleCodeLanguageChange = (nodeElement: HTMLElement) => {
    return;
};

export const handleCodeSetFold = (nodeElement: Element) => {
    // do nothing
};

export const handleCodeSetPadding = (protyle: IProtyle) => {
    // do nothing
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
