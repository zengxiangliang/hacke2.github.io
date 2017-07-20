---
layout: post
title: UI-ROUTER
description: "UI-ROUTER"
tags: [读书笔记]
image:
  background: witewall_3.png
comments: true
share: true
---
[[Next (Nested States & Nested Views) ►|Nested States and Nested Views]]

##### This In-Depth Guide will take you through all aspects of the UI-Router and its components and options. If you just need a quick reference guide visit the [API Reference](http://angular-ui.github.io/ui-router/site)

## State Manager.

The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely on state. 
* A state corresponds to a "place" in the application in terms of the overall UI and navigation. 
* A state (via the controller / template / view properties) describes what the UI looks like and does at that place. 
* States often have things in common, and the primary way of factoring out these commonalities in this model is via the state hierarchy, i.e. parent/child states aka nested states. 

### The simplest form of state
A state in its simplest form can be added like this (typically within `module.config`):
```html
<!-- in index.html -->
<body ng-controller="MainCtrl">
  <section ui-view></section>
</body>
```
```javascript
// in app-states.js (or whatever you want to name it)
$stateProvider.state('contacts', {
  template: '<h1>My Contacts</h1>'
})
```

#### Where does the template get inserted?
When a state is activated, its templates are automatically inserted into the `ui-view` of its parent state's template. If it's a top-level state—which 'contacts' is because it has no parent state–then its parent template is index.html.

Right now, the 'contacts' state won't ever be activated. So let's see how we can activate a state. 

#### Activating a state
There are three main ways to activate a state:

1. Call `$state.go()`. High-level convenience method. [Learn More](https://github.com/angular-ui/ui-router/wiki/Quick-Reference#stategoto--toparams--options)
2. Click a link containing the `ui-sref` directive. [Learn More](https://github.com/angular-ui/ui-router/wiki/Quick-Reference#ui-sref)
3. Navigate to the `url` associated with the state. [[Learn More|URL Routing]].

***

### Templates

There are several methods for configuring a state's template.

As seen above, the simplest way to set your template is via the `template` config property.
```javascript
$stateProvider.state('contacts', {
  template: '<h1>My Contacts</h1>'
})
```

Instead of writing the template inline you can load a partial. (This is probably how you'll set templates most of the time.)
```javascript
$stateProvider.state('contacts', {
  templateUrl: 'contacts.html'
})
```
`templateUrl` can also be a function that returns a url. It takes one preset parameter, stateParams, which is not injected. 
```javascript
$stateProvider.state('contacts', {
  templateUrl: function ($stateParams){
    return '/partials/contacts.' + $stateParams.filterBy + '.html';
  }
})
```
Or you can use a template provider function which can be injected, has access to locals, and must return template HTML, like this:
```javascript
$stateProvider.state('contacts', {
  templateProvider: function ($timeout, $stateParams) {
    return $timeout(function () {
      return '<h1>' + $stateParams.contactId + '</h1>'
    }, 100);
  }
})
```
If you'd like your `<ui-view>` to have some default content before it's populated by a state activation, you can do that as well. The contents will be replaced as soon as a state is activated and populates the ui-view with a template.
```html
<body>
    <ui-view>
        <i>Some content will load here!</i>
    </ui-view>
</body>
```

### Controllers
You can assign a controller to your template. **Warning:** The controller will **not** be instantiated if template is not defined. 

You set your `controller` like this:
```javascript
$stateProvider.state('contacts', {
  template: '<h1>{{title}}</h1>',
  controller: function($scope){
    $scope.title = 'My Contacts';
  }
})
```

Or if you already have a `controller` defined on the module, like this:
```javascript
$stateProvider.state('contacts', {
  template: ...,
  controller: 'ContactsCtrl'
})
```

Alternatively using the "controller as" syntax the above becomes:
```javascript
$stateProvider.state('contacts', {
  template: '<h1>{{contact.title}}</h1>',
  controller: function(){
    this.title = 'My Contacts';
  },
  controllerAs: 'contact'
})
```
and

```javascript
$stateProvider.state('contacts', {
  template: ...,
  controller: 'ContactsCtrl as contact'
})
```

Or for more advanced needs you can use the `controllerProvider` to dynamically return a controller function or string for you:
```javascript
$stateProvider.state('contacts', {
  template: ...,
  controllerProvider: function($stateParams) {
      var ctrlName = $stateParams.type + "Controller";
      return ctrlName;
  }
})
```

Controllers can use the $scope.$on() method to listen for events fired by state transitions.

Controllers are instantiated on an as-needed basis, when their corresponding scopes are created, i.e. when the user manually navigates to a state via a URL, $stateProvider will load the correct template into the view, then bind the controller to the template's scope.

#### Resolve
You can use `resolve` to provide your controller with content or data that is custom to the state. `resolve` is an optional map of dependencies which should be injected into the controller. 

If any of these dependencies are promises, they will be resolved and converted to a value **before** the controller is instantiated and the $stateChangeSuccess event is fired. 

The `resolve` property is a map object. The map object contains key/value pairs of:
* key – {string}: a name of a dependency to be injected into the controller.
* factory - {string|function}: 
    * If string, then it is an alias for a service. 
    * Otherwise if function, then it is injected and the return value is treated as the dependency. If the result is a promise, it is resolved before the controller is instantiated and its value is injected into the controller.

**Examples:**

Each of the objects in `resolve` below must be resolved (via `deferred.resolve()` if they are a promise) before the `controller` is instantiated. Notice how each resolve object is injected as a parameter into the controller.

```javascript
$stateProvider.state('myState', {
      resolve:{

         // Example using function with simple return value.
         // Since it's not a promise, it resolves immediately.
         simpleObj:  function(){
            return {value: 'simple!'};
         },

         // Example using function with returned promise.
         // This is the typical use case of resolve.
         // You need to inject any services that you are
         // using, e.g. $http in this example
         promiseObj:  function($http){
            // $http returns a promise for the url data
            return $http({method: 'GET', url: '/someUrl'});
         },

         // Another promise example. If you need to do some 
         // processing of the result, use .then, and your 
         // promise is chained in for free. This is another
         // typical use case of resolve.
         promiseObj2:  function($http){
            return $http({method: 'GET', url: '/someUrl'})
               .then (function (data) {
                   return doSomeStuffFirst(data);
               });
         },        

         // Example using a service by name as string.
         // This would look for a 'translations' service
         // within the module and return it.
         // Note: The service could return a promise and
         // it would work just like the example above
         translations: "translations",

         // Example showing injection of service into
         // resolve function. Service then returns a
         // promise. Tip: Inject $stateParams to get
         // access to url parameters.
         translations2: function(translations, $stateParams){
             // Assume that getLang is a service method
             // that uses $http to fetch some translations.
             // Also assume our url was "/:lang/home".
             return translations.getLang($stateParams.lang);
         },

         // Example showing returning of custom made promise
         greeting: function($q, $timeout){
             var deferred = $q.defer();
             $timeout(function() {
                 deferred.resolve('Hello!');
             }, 1000);
             return deferred.promise;
         }
      },

      // The controller waits for every one of the above items to be
      // completely resolved before instantiation. For example, the
      // controller will not instantiate until promiseObj's promise has 
      // been resolved. Then those objects are injected into the controller
      // and available for use.  
      controller: function($scope, simpleObj, promiseObj, promiseObj2, translations, translations2, greeting){
          $scope.simple = simpleObj.value;

          // You can be sure that promiseObj is ready to use!
          $scope.items = promiseObj.data.items;
          $scope.items = promiseObj2.items;

          $scope.title = translations.getLang("english").title;
          $scope.title = translations2.title;

          $scope.greeting = greeting;
      }
   })
```

[Learn more](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-resolved-dependencies) about how resolved dependencies are inherited down to child states.

#### Attach Custom Data to State Objects
You can attach custom data to the state object (we recommend using a `data` property to avoid conflicts). 
```javascript
// Example shows an object-based state and a string-based state
var contacts = { 
    name: 'contacts',
    templateUrl: 'contacts.html',
    data: {
        customData1: 5,
        customData2: "blue"
    }  
}
$stateProvider
  .state(contacts)
  .state('contacts.list', {
    templateUrl: 'contacts.list.html',
    data: {
        customData1: 44,
        customData2: "red"
    } 
  })
```
With the above example states you could access the data like this:
```javascript
function Ctrl($state){
    console.log($state.current.data.customData1) // outputs 5;
    console.log($state.current.data.customData2) // outputs "blue";
}
```

[Learn more](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data) about how custom data properties are inherited down to child states.

### onEnter and onExit callbacks
There are also optional 'onEnter' and 'onExit' callbacks that get called when a state becomes active and inactive respectively. The callbacks also have access to all the resolved dependencies.
```javascript
$stateProvider.state("contacts", {
  template: '<h1>{{title}}</h1>',
  resolve: { 
     title: function () { 
       return 'My Contacts' 
     } 
  },
  controller: function($scope, title){
    $scope.title = title;
  },
  onEnter: function(title){
    if(title){ ... do something ... }
  },
  onExit: function(title){
    if(title){ ... do something ... }
  }
})
```

### State Change Events

**NOTE: State change events are deprecated, DISABLED and replaced by Transition Hooks as of version 1.0 ([details](https://ui-router.github.io/guide/ng1/migrate-to-1_0#state-change-events))**

All these events are fired at the `$rootScope` level.

* **$stateChangeStart** - fired when the transition **begins**.
```javascript
$rootScope.$on('$stateChangeStart', 
function(event, toState, toParams, fromState, fromParams, options){ ... })
```
**Note:** Use event.preventDefault() to prevent the transition from happening.
```javascript
$rootScope.$on('$stateChangeStart', 
function(event, toState, toParams, fromState, fromParams, options){ 
    event.preventDefault(); 
    // transitionTo() promise will be rejected with 
    // a 'transition prevented' error
})
```
* **$stateNotFound** - `v0.3.0` - fired when a requested state **cannot be found** using the provided state name during transition. The event is broadcast allowing any handlers a single chance to deal with the error (usually by lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler, you can see its three properties in the example. Use `event.preventDefault()` to abort the transition (transitionTo() promise will be rejected with a 'transition aborted' error). For a more in-depth example on lazy loading states, see [How To: Lazy load states](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-lazy-load-states)

```javascript
// somewhere, assume lazy.state has not been defined
$state.go("lazy.state", {a:1, b:2}, {inherit:false});

// somewhere else
$rootScope.$on('$stateNotFound', 
function(event, unfoundState, fromState, fromParams){ 
    console.log(unfoundState.to); // "lazy.state"
    console.log(unfoundState.toParams); // {a:1, b:2}
    console.log(unfoundState.options); // {inherit:false} + default options
})
```
* **$stateChangeSuccess** - fired once the state transition is **complete**. 
```javascript
$rootScope.$on('$stateChangeSuccess', 
function(event, toState, toParams, fromState, fromParams){ ... })
```
* **$stateChangeError** - fired when an **error occurs** during transition. It's important to note that if you have any errors in your `resolve` functions (javascript errors, non-existent services, etc) they will not throw traditionally. You must listen for this $stateChangeError event to catch ALL errors. Use `event.preventDefault()` to prevent the $UrlRouter from reverting the URL to the previous valid location (in case of a URL navigation).
```javascript
$rootScope.$on('$stateChangeError', 
function(event, toState, toParams, fromState, fromParams, error){ ... })
```

### View Load Events

* **$viewContentLoading** - fired once the view **begins** loading, **before** the DOM is rendered. The '$rootScope' broadcasts the event.
```javascript
$rootScope.$on('$viewContentLoading', 
function(event, viewConfig){ 
    // Access to all the view config properties.
    // and one special property 'targetView'
    // viewConfig.targetView 
});
```

* **$viewContentLoaded** - fired once the view is **loaded**, **after** the DOM is rendered. The '$scope' of the view emits the event.
```javascript
$scope.$on('$viewContentLoaded', 
function(event){ ... });
```

[[Next (Nested States & Nested Views) ►|Nested States and Nested Views]]