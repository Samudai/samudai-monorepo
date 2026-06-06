import { createContext, useContext, useRef } from 'react';
import { useState } from 'react';
import { BaseSelection } from 'slate';
import { useForceUpdate } from './use-force-update';

type UseLinkPopupContextType = {
    input: { current: HTMLInputElement | null };
    selection: { current: BaseSelection | null };
    hadHref: { current: boolean };
    active: { current: boolean };
    href: string;
    setActive: (bool: boolean) => void;
    setHref: (value: string) => void;
};

export const LinkPopupContext = createContext<UseLinkPopupContextType>({
    input: { current: null },
    selection: { current: null },
    hadHref: { current: false },
    active: { current: false },
    href: '',
    setActive: () => null,
    setHref: () => null,
});

export const useLinkPopupInitialValue = () => {
    const [href, setHref] = useState('');
    const active = useRef(false);
    const forceUpdate = useForceUpdate();

    const setActive = (bool: boolean) => {
        active.current = bool;
        forceUpdate();
    };

    return {
        input: useRef<HTMLInputElement>(null),
        selection: useRef<BaseSelection | null>(null),
        hadHref: useRef<boolean>(false),
        active,
        href,
        setHref,
        setActive,
    };
};

export const useLinkPopupState = () => {
    return useContext(LinkPopupContext);
};

export const useLinkPopupActions = () => {
    const state = useLinkPopupState();
    const forceUpdate = useForceUpdate();

    const show = (selection: BaseSelection, href?: string) => {
        state.selection.current = selection;
        state.setActive(true);
        if (href) {
            state.setHref(href);
            state.hadHref.current = true;
        }
    };

    const setHasHref = () => {
        state.hadHref.current = true;
        forceUpdate();
    };

    const removeHasHref = () => {
        state.hadHref.current = false;
        forceUpdate();
    };

    const hide = () => {
        state.setActive(false);
    };

    const reset = () => {
        state.selection.current = null;
        state.hadHref.current = false;
        state.setHref('');
    };

    const focus = () => {
        if (!state.input.current) return;
        state.input.current.focus();
    };

    const update = () => {
        forceUpdate();
    };

    return {
        show,
        hide,
        reset,
        update,
        setHasHref,
        removeHasHref,
        focus,
    };
};
