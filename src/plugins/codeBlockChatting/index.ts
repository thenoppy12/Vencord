/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";

const setting = definePluginSettings({
    codeBlockLanguage: {
        type: OptionType.STRING,
        description: "Language use for codeblock (ex: ```py\\n{contents}\\n```). Required or it just a txt.",
        default: "txt"
    }
});
let isEnabled:boolean = false;
const log = new Logger("CodeBlockChatting", "#8caaee");

// idk how to make shortcut button using svg. sorry for inconvenience
export default definePlugin({
    name: "CodeBlockChatting",
    description: "Automatically add codeblock \"```\" at head and end of message. (j4f) (buggy + much unexpected behaviors rn)",
    authors: [Devs.thenoppy12],
    settings: setting,
    enabledByDefault: false,
    async onBeforeMessageSend(_, msg) {
        log.log("MessageEvent received.");
        if (isEnabled) {
            const content = msg.content.trim();
            const lang = setting.store.codeBlockLanguage;
            if (
                content.startsWith("```") || // multiline codeblocks
                content.startsWith("*") || // italics, bold, bold italics
                content.startsWith("_") || // underline
                content.startsWith("~") || // strikethrough
                content.startsWith("#") || // headers
                content.startsWith("-#") || // subtext
                content.startsWith("[") || // links
                content.startsWith("- ") || content.startsWith("* ") || // lists (maybe?)
                content.startsWith("`") || // singleline codeblocks
                content.startsWith(">") || // block quotes
                // can be more? edit this fk as you like
                content.length === 0
            ) return;
            msg.content = `\`\`\`${lang}\n${content}\n\`\`\``;
        }
    },
    start() {
        isEnabled = true;
    },
    stop() {
        isEnabled = false;
    }
});
