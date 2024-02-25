import { SafeMode } from "$state/Desktop/ts/store";
import { MessagingIcon } from "$ts/images/apps";
import { App } from "$types/app";
import AppSvelte from "../App.svelte";
import { Runtime } from "./runtime";

export const MessagingApp: App = {
  metadata: {
    name: "Messages",
    description: "Send messages to other ArcOS users",
    author: "The ArcOS Team",
    version: "2.0.0",
    icon: MessagingIcon,
    appGroup: "communication",
  },
  runtime: Runtime,
  content: AppSvelte,
  id: "MessagingApp",
  size: { w: 1000, h: 700 },
  minSize: { w: 900, h: 550 },
  maxSize: { w: 1800, h: 1000 },
  pos: { x: 100, y: 100 },
  state: {
    minimized: false,
    maximized: false,
    headless: true,
    fullscreen: false,
    resizable: true,
  },
  controls: {
    minimize: true,
    maximize: true,
    close: true,
  },
  glass: true,
  singleInstance: true,
  loadCondition: () => !SafeMode.get(),
};
