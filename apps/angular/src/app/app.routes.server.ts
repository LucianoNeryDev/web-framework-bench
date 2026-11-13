import { RenderMode, ServerRoute } from '@angular/ssr';

// Server mode: every route is rendered per request.
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Server }];
