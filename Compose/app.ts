import { MessagingIcon } from "$ts/images/apps";
import { App } from "$types/app";
import ComposeSvelte from "./Compose.svelte";
import { ComposeRuntime } from "./runtime";

export const ComposeApp: App = {
  metadata: {
    name: "Compose Message",
    description: "Compose a new message",
    icon: MessagingIcon,
    author: "The ArcOS Team",
    version: "1.0.0",
  },
  runtime: ComposeRuntime,
  content: ComposeSvelte,
  id: "MessageComposer",
  size: { w: 650, h: 500 },
  minSize: { w: 650, h: 500 },
  maxSize: { w: 650, h: 500 },
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
