### Vote on specifications so we can reach a conclusion

* Add a **+** on a feature or design point you concur
* Add a **-** on a feature or design point you do not like
* Create a new bullet for new feature/design points
  * Nest bullets if they are related or subfeatures/points
  * Keep bullets **concise**
* Vote count will decide priority
  * You can vote on any bullet once
* Avoid 'discussing' bullets here. If you disagree, down-vote and discuss in [#1](https://github.com/angular-ui/router/issues/1)

# Router Specifications

0. API should be backwards-compatible with current router (+0 / -0)
1. Defining routes
  1. Should be a recursively nested object (+5 / -2)
  2. Can append more children later in separate method call: `andWhen('/parent/route', '/child')` (+1 / -3)
  3. Can define an 'otherwise' clause for nested routes (identical to `otherwise()`) (+2 / -0)
  4. Routes can specify subroutes AND multiple views. Views are the "leafs" in the tree. (+2 / 0)
  5. Routes should have an identifier other than their URL pattern (+1 / 0)
2. Parameters
  1. Should support an optional syntax: `/user/:id[/:searchTerm]` (+3 / -4)
  2. Should support typecasting syntax: `/user/int:id` (+3 / -3)
  3. Parameter parsing should be handled by a separate service: (+1 / 0)
3. Route / View Names
  1. Should be optional 
     1. Single view (+4 / -0)
     2. If nested view, unnamed route uses unnamed view at the same nesting level (+2 / -1)
  2. Names circumvent nesting level (+2 / -1)
4. Loading Controllers
  1. All descendant controllers are reloaded (+3 / -1)
  2. `$routeUpdated` event is `$broadcast` instead of reloading controller
     1. Always use event (+0 / -2)
     2. Provide optional to opt-in, otherwise reload controller (+3 / -0)
     3. Provide option to opt-in recursively (instead of this controller only) (+0 / -1)
  3. If child route no longer matches
     1. controller is unloaded (+1 / -1)
       1. option to disable unloading (+3 / -0)
     2. related view is emptied (+2 / -1)
       1. option to disable unloading (+2 / -1)
  4. Descendant controllers should have access to scope content of ancestors (+4 / -1)
  5. Routes can specify a single controller for each view (named views). (+1 / 0)
     1. Additionally a model can be passed to set the content of the controller (+1 / 0)
5. Utilities
  1. Publicly providers a route checking  (+1 / -0)
    1. Simplistic REGEX function: `uiRouter.is('/some/*')` (+1 / -0)
    2. Developers can place onto scope: `$rootScope.isRoute = uiRouter.is` (+0 / -0)
    3. Directive to toggle an active class (+1 / -0)
