import { EditorAlignFormats, EditorListEnum } from 'components/editor/types';
import React from 'react';
import { EditorButton } from '../editor-button';
import { EditorFont } from '../editor-font';
import {
    BlockquoteIcon,
    BoldIcon,
    CenterAlignIcon,
    ItalicIcon,
    JustifycenterAlignIcon,
    LeftAlignIcon,
    OlListIcon,
    RightAlignIcon,
    UlListIcon,
    UnderlineIcon,
} from '../icons';
import css from './editor-toolbar.module.scss';

const EditorToolbarGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className={css.group}>{children}</div>;
};

export const EditorToolbar: React.FC = () => {
    return (
        <div className={css.toolbar}>
            <div className={css.toolbar_wrapper}>
                <EditorToolbarGroup>
                    <EditorButton format="bold" icon={BoldIcon} />
                    <EditorButton format="italic" icon={ItalicIcon} />
                    <EditorButton format="underline" icon={UnderlineIcon} />
                </EditorToolbarGroup>

                <EditorToolbarGroup>
                    <EditorButton isElement format={EditorAlignFormats.LEFT} icon={LeftAlignIcon} />
                    <EditorButton
                        isElement
                        format={EditorAlignFormats.CENTER}
                        icon={CenterAlignIcon}
                    />
                    <EditorButton
                        isElement
                        format={EditorAlignFormats.RIGHT}
                        icon={RightAlignIcon}
                    />
                    <EditorButton
                        isElement
                        format={EditorAlignFormats.JUSTIFY}
                        icon={JustifycenterAlignIcon}
                    />
                </EditorToolbarGroup>

                <EditorToolbarGroup>
                    <EditorButton isElement format={EditorListEnum.BULLETED} icon={UlListIcon} />
                    <EditorButton isElement format={EditorListEnum.NUMBERED} icon={OlListIcon} />
                </EditorToolbarGroup>

                <EditorToolbarGroup>
                    <EditorButton isElement format="block-quote" icon={BlockquoteIcon} />
                </EditorToolbarGroup>

                <EditorToolbarGroup>
                    <EditorFont />
                </EditorToolbarGroup>
            </div>
        </div>
    );
};
