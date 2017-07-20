## Update 2015-05-18 
This functionality seems to be [long gone](https://github.com/angular-ui/ui-router/issues/66#issuecomment-49115929) (sometime prior to 0.2.10). If you're trying to migrate from ngRoute to ui-router, it looks like you're on your own!

## Overview

Full backwards compatibility with $routeProvider is **not** a primary goal this project. However, we are trying to have a clear migration path from $routeProvider to $stateProvider, and to use compatible terminology where this is possible and makes sense. At this point, most features of $routeProvider cleanly map to a sub-set of $stateProvider functionality, so that providing a compatibility shim that allows applications to be migrated bit by bit is feasible.

##ui.router.compat module

The `ui.router.compat` module should be used when you are migrating an existing angular application over to ui-router and you do not want to replace the current instances of `ng-view` and `$route`. `ui.router.compat` defines its own versions of `ng-view` and `$route`. They will behave just like the originals, but behind the scenes they will now be using ui-router internals. Then you can use `$state` and `ui-view` in new parts of your migrated application.

**Note:** The `ui.router.compat` module has `ui.router.state` as a dependency. So you are essentially loading the `ui.router.state` module and then `ui.router.compat` adds an compatibility layer on top of it that redefines `ng-view` and `$route/$routeProvider`.