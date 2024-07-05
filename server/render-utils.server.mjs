import './polyfills.server.mjs';
import {
  ApplicationRef,
  Compiler,
  Console,
  INITIAL_CONFIG,
  INTERNAL_SERVER_PLATFORM_PROVIDERS,
  Router,
  SERVER_CONTEXT,
  createPlatformFactory,
  loadChildren,
  platformCore,
  renderApplication,
  renderModule,
  resetCompiledComponents,
  whenStable
} from "./chunk-4VR5P7ZM.mjs";
import {
  __asyncGenerator,
  __await,
  __yieldStar
} from "./chunk-YBYOXPTQ.mjs";

// angular:server-render-utils:angular:server-render-utils
function getRoutesFromRouterConfig(routes, compiler, parentInjector, parentRoute = "") {
  return __asyncGenerator(this, null, function* () {
    for (const route of routes) {
      const { path, redirectTo, loadChildren: loadChildren2, children } = route;
      if (path === void 0) {
        continue;
      }
      const currentRoutePath = buildRoutePath(parentRoute, path);
      if (redirectTo !== void 0) {
        yield { route: currentRoutePath, success: false, redirect: true };
        continue;
      }
      if (/[:*]/.test(path)) {
        yield { route: currentRoutePath, success: false, redirect: false };
        continue;
      }
      yield { route: currentRoutePath, success: true, redirect: false };
      if (children?.length) {
        yield* __yieldStar(getRoutesFromRouterConfig(children, compiler, parentInjector, currentRoutePath));
      }
      if (loadChildren2) {
        const loadedChildRoutes = yield new __await(loadChildren(route, compiler, parentInjector).toPromise());
        if (loadedChildRoutes) {
          const { routes: childRoutes, injector = parentInjector } = loadedChildRoutes;
          yield* __yieldStar(getRoutesFromRouterConfig(childRoutes, compiler, injector, currentRoutePath));
        }
      }
    }
  });
}
function extractRoutes(bootstrapAppFnOrModule, document) {
  return __asyncGenerator(this, null, function* () {
    const platformRef = createPlatformFactory(platformCore, "server", [
      {
        provide: INITIAL_CONFIG,
        useValue: { document, url: "" }
      },
      {
        provide: Console,
        /** An Angular Console Provider that does not print a set of predefined logs. */
        useFactory: () => {
          class Console2 extends Console {
            ignoredLogs = /* @__PURE__ */ new Set(["Angular is running in development mode."]);
            log(message) {
              if (!this.ignoredLogs.has(message)) {
                super.log(message);
              }
            }
          }
          return new Console2();
        }
      },
      ...INTERNAL_SERVER_PLATFORM_PROVIDERS
    ])();
    try {
      let applicationRef;
      if (isBootstrapFn(bootstrapAppFnOrModule)) {
        applicationRef = yield new __await(bootstrapAppFnOrModule());
      } else {
        const moduleRef = yield new __await(platformRef.bootstrapModule(bootstrapAppFnOrModule));
        applicationRef = moduleRef.injector.get(ApplicationRef);
      }
      yield new __await(whenStable(applicationRef));
      const injector = applicationRef.injector;
      const router = injector.get(Router);
      if (router.config.length === 0) {
        yield { route: "", success: true, redirect: false };
      } else {
        const compiler = injector.get(Compiler);
        yield* __yieldStar(getRoutesFromRouterConfig(router.config, compiler, injector));
      }
    } finally {
      platformRef.destroy();
    }
  });
}
function isBootstrapFn(value) {
  return typeof value === "function" && !("\u0275mod" in value);
}
function buildRoutePath(...routeParts) {
  return routeParts.filter(Boolean).join("/");
}
export {
  extractRoutes,
  renderApplication,
  renderModule,
  Console as \u0275Console,
  SERVER_CONTEXT as \u0275SERVER_CONTEXT,
  resetCompiledComponents as \u0275resetCompiledComponents
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
//# sourceMappingURL=render-utils.server.mjs.map
