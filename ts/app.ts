import { DefaultIcon } from "$ts/images/apps";
import { Runtime } from "./runtime";
import AppSvelte from "../App.svelte";
import { App } from "$types/app";

export const MessagingApp: App = {
  metadata: {
    name: "Messages",
    description: "This is an app template",
    author: "The ArcOS Team",
    version: "2.0.0",
    icon: DefaultIcon
  },
  runtime: Runtime,
  content: AppSvelte,
  id: "MessagingApp",
  size: { w: 600, h: 450 },
  minSize: { w: 500, h: 300 },
  maxSize: { w: 1800, h: 1000 },
  pos: { x: 100, y: 100 },
  state: {
    minimized: false,
    maximized: false,
    headless: false,
    fullscreen: false,
    resizable: true
  },
  controls: {
    minimize: true,
    maximize: true,
    close: true
  }
}