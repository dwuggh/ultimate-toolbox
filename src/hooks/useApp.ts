import { initDevtools } from "@pixi/devtools";
import { useApplication } from "@pixi/react";


export default function useApp(debug: boolean) {
	
  const app = useApplication();
  if (debug) {
  	initDevtools(app);
  	(globalThis as any).__PIXI_APP__ = app.app;

  }
  return app;
}