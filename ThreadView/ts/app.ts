import { MessagingIcon } from "$ts/images/apps";
import { App } from "$types/app";
import ComposeSvelte from "../ThreadView.svelte";
import { ThreadViewRuntime } from "./runtime";

export const ThreadViewApp: App = {
  metadata: {
    name: "MsgThreadView",
    description: "View the thread of a message",
    icon: MessagingIcon,
    author: "The ArcOS Team",
    version: "2.0.0",
  },
  runtime: ThreadViewRuntime,
  content: ComposeSvelte,
  id: "ThreadView",
  size: { w: 500, h: 500 },
  minSize: { w: 500, h: 500 },
  maxSize: { w: 500, h: 500 },
  pos: { x: 0, y: 0 },
  state: {
    maximized: false,
    minimized: false,
    fullscreen: false,
    resizable: false,
    headless: true,
  },
  controls: {
    minimize: false,
    maximize: false,
    close: false,
  },
  isOverlay: true,
};
