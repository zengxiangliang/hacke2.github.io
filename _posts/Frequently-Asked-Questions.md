### Table of Contents:

**How Tos:**

How Tos are solutions to common problems. They aren't necessarily the only solution to the problem but typically stemmed from a discussion in an issues thread, where we didn't want to add a new feature but realized it may not be clear how to achieve a certain functionality.

* [How to: Configure ui-router from multiple modules](Frequently-Asked-Questions#how-to-configure-ui-router-from-multiple-modules)
* [How to: Open a dialog/modal at a certain state](Frequently-Asked-Questions#how-to-open-a-dialogmodal-at-a-certain-state)
* [How to: Animate ui-view with ng-animate](Frequently-Asked-Questions#how-to-animate-ui-view-with-ng-animate)
* [How to: Configure your server to work with html5Mode](Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode)
* [How to: Set up a default/index child state](Frequently-Asked-Questions#how-to-set-up-a-defaultindex-child-state)
* [How to: Use require.js with ui-router](Frequently-Asked-Questions#how-to-use-requirejs-with-ui-router)
* [How to: Lazy load states](Frequently-Asked-Questions#how-to-lazy-load-states)
* [How to: Make states work with tabs](Frequently-Asked-Questions#how-to-make-parallel-states-aka-sticky-states-aka-tabs)
* [How to: Retain a state's state](Frequently-Asked-Questions#how-to-retain-a-states-state-scope-and-scroll-position)
* [How to: Make trailing slash optional](#how-to-make-a-trailing-slash-optional-for-all-routes)
* [How to: Create rules to prevent access to a state](Frequently-Asked-Questions#how-to-create-rules-to-prevent-access-to-a-state)
* [How to: Prevent nested ui-sref objects from all firing/triggering](Frequently-Asked-Questions#how-to-prevent-nested-ui-sref-objects-from-all-firingtriggering)


**Popular Issues:**
* [Issue: I'm getting a blank screen, and there are NO errors!](Frequently-Asked-Questions#issue-im-getting-a-blank-screen-and-there-are-no-errors)
* [Issue: My templates are not appearing / loading / showing](Frequently-Asked-Questions#issue-my-templates-are-not-appearing--loading--showing)
* [Issue: My assets and templates are not loading](Frequently-Asked-Questions#issue-my-assets-and-templates-are-not-loading)
* [Issue: Problems when using ng-view alongside ui-view](Frequently-Asked-Questions#issue-problems-when-using-ng-view-alongside-ui-view)
* [Issue: JavaScript errors don't throw within resolve functions](Frequently-Asked-Questions#issue-javascript-errors-dont-throw-within-resolve-functions)
* [Issue: `TypeError: Attempted to assign to readonly property` when running `grunt` tests](Frequently-Asked-Questions#issue-typeerror-attempted-to-assign-to-readonly-property-when-running-grunt-tests)
* [Issue: Firefox is throwing a `b.shift is not a fuction error`](Frequently-Asked-Questions#issue-firefox-is-throwing-a-bshift-is-not-a-fuction-error-other-browsers-are-operating-normally)
* [Issue: What is the difference between `$state.params` and `$stateParams`?](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#issue-what-is-the-difference-between-stateparams-and-stateparams)

***

## How to: Configure ui-router from multiple modules

With [#492](https://github.com/angular-ui/ui-router/pull/492) merged (v0.2.8), you can now register states in any order and across modules. You can register children before the parent state exists. It will queue them up and once the parent state is registered then the child will be registered. Note: You still need to manage module dependencies.

```javascript
angular.module('main', ['main.page1']).config(function($stateProvider) {
    $stateProvider.state('main', {...})
});

angular.module('main.page1', []).config(function($stateProvider) {
    $stateProvider.state('main.page1', {...})
});
```

**Note:** Remember only to declare dependencies once per module creation, so if you make several calls to `angular.module` for the same module, only the first should define dependencies.


## How To: Open a dialog/modal at a certain state

How do I tell ui-router that I'd like a certain state to open a dialog or modal instead of swapping out ui-view templates?

Here's an example of to do it using ui-bootstrap's [$uibModal](http://angular-ui.github.io/bootstrap/#modal) service. This example only specifies an onEnter function. There is no template, controller, etc. So essentially the modal is shown, then when it's closed it returns to the `items` state. You are still responsible for handling what state your app transitions to when the modal closes.

```javascript
$stateProvider.state("items.add", {
    url: "/add",
    onEnter: ['$stateParams', '$state', '$uibModal', '$resource', function($stateParams, $state, $uibModal, $resource) {
        $uibModal.open({
            templateUrl: "items/add",
            resolve: {
              item: function() { new Item(123).get(); }
            },
            controller: ['$scope', 'item', function($scope, item) {
              $scope.dismiss = function() {
                $scope.$dismiss();
              };
              
              $scope.save = function() {
                item.update().then(function() {
                  $scope.$close(true);
                });
              };
            }]
        }).result.finally(function() {
            $state.go('^');
        });
    }]
});
```

## How to: Animate ui-view with ng-animate

How do I add animation effects to the ui-view templates that are loaded?

#### Angular 1.2+ animation syntax

This is just one example of how you can do it. I had to set the ui-view container to be position relative as well as set the ui-view to be position absolute to obtain the effect I wanted, but those are not required depending on the effect you are trying to achieve.

**Plunkr:** http://plnkr.co/edit/NsZhDL?p=preview

**HTML**
```html
<div class="row">
   <div class="span12 ui-view-container">
      <div class="well" ui-view></div>        
   </div>
</div> 
```

**CSS**
```css
/* Have to set height explicity on ui-view 
to prevent collapsing during animation*/
.ui-view-container {
  position: relative;
  height: 65px;
}

[ui-view].ng-enter, [ui-view].ng-leave {
  position: absolute;
  left: 0;
  right: 0;
  -webkit-transition:all .5s ease-in-out;
	-moz-transition:all .5s ease-in-out;
	-o-transition:all .5s ease-in-out;
	transition:all .5s ease-in-out;
}

[ui-view].ng-enter {
  opacity: 0;
  -webkit-transform:scale3d(0.5, 0.5, 0.5);
  -moz-transform:scale3d(0.5, 0.5, 0.5);
  transform:scale3d(0.5, 0.5, 0.5);
}

[ui-view].ng-enter-active {
  opacity: 1;
  -webkit-transform:scale3d(1, 1, 1);
  -moz-transform:scale3d(1, 1, 1);
  transform:scale3d(1, 1, 1);
}

[ui-view].ng-leave {
  opacity: 1; 
  -webkit-transform:translate3d(0, 0, 0);
  -moz-transform:translate3d(0, 0, 0);
  transform:translate3d(0, 0, 0);
}

[ui-view].ng-leave-active {
  opacity: 0;
  -webkit-transform:translate3d(100px, 0, 0);
  -moz-transform:translate3d(100px, 0, 0);
  transform:translate3d(100px, 0, 0);
}
```

Another forward、go back animation [demo](http://run.plnkr.co/plunks/3cBugxsAglHHpt9XAkMp/) :  http://plnkr.co/edit/3cBugxsAglHHpt9XAkMp


#### Angular 1.1.5 animation syntax (using ng-animate directive)

Make sure you are using the 1.1.5 version of Angular. It's not the newest angular but this is for devs who may be stuck with that version (Note: 1.1.4 had a totally different syntax that won't work with this example).

**Plunkr:** http://plnkr.co/edit/EmNvz8?p=preview

Add `ng-animate="'view'"` to your ui-view:
```html
<div ui-view ng-animate="'view'"></div> 
```

The animation class doesn't have to be "view" that's just an example. Then create a view-enter, view-enter-active, view-leave, and view-leave-active class styles in your css.  The "-enter" class will be used to set up the animations and the "-enter-active" will be used as the end point of the animation.

## How to: Configure your server to work with html5Mode

When I add `$locationProvider.html5Mode(true)`, my site will not allow pasting of urls. How do I configure my server to work when html5Mode is true?

*Warning:* If you have server side rewrites already set up and still experience issues, please see [Issue: assets and templates are not loading](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#issue-my-assets-and-templates-are-not-loading).

When you have html5Mode enabled, the `#` character will no longer be used in your urls. The `#` symbol is useful because it requires no server side configuration. Without `#`, the url looks much nicer, but it also requires server side rewrites. Here are some examples:

**Apache Rewrites**
```apache
<VirtualHost *:80>
    ServerName my-app

    DocumentRoot /path/to/app

    <Directory /path/to/app>
        RewriteEngine on

        # Don't rewrite files or directories
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]

        # Rewrite everything else to index.html to allow html5 state links
        RewriteRule ^ index.html [L]
    </Directory>
</VirtualHost>
```

**Nginx Rewrites**
```nginx
server {
    server_name my-app;
    
    index index.html;

    root /path/to/app;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Azure IIS Rewrites**
```xml
<system.webServer>
  <rewrite>
    <rules> 
      <rule name="Main Rule" stopProcessing="true">
        <match url=".*" />
        <conditions logicalGrouping="MatchAll">
          <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />                                 
          <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
        </conditions>
        <action type="Rewrite" url="/" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
```

**Express Rewrites**

```javascript
var express = require('express');
var app = express();

app.use('/js', express.static(__dirname + '/js'));
app.use('/dist', express.static(__dirname + '/../dist'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname });
});

app.listen(3006); //the port you want to use
```

Also, read this great tutorial about [Angular + Express](http://briantford.com/blog/angular-express.html)

**ASP.Net C# Rewrites**

In Global.asax

```C#
private const string ROOT_DOCUMENT = "/default.aspx";

protected void Application_BeginRequest( Object sender, EventArgs e )
{
	string url = Request.Url.LocalPath;
	if ( !System.IO.File.Exists( Context.Server.MapPath( url ) ) )
		Context.RewritePath( ROOT_DOCUMENT );
}
```

**Java EE**

In web.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="3.0" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
	<error-page>
		<error-code>404</error-code>
		<location>/</location>
	</error-page>
</web-app>
```

**Play Framework**
In routes file:
```
GET        /                                 controllers.Application.index(someRandomParameter = "real index")
# All other routes should be here, in between
GET        /*someRandomParameter             controllers.Application.index(someRandomParameter)
```


## How to: Set up a default/index child state

When I have several nested states, how do I set up one particular child state to be the index, or default, state of its parent?

Let's say you have the following states:
* 'parent'
* 'parent.index'
* 'parent.page2'

You want that when the user tries to go to 'parent', it will automatically go to 'parent.index'.

1. First, add a property to the `'parent'` state of `abstract:true`. You want to set this since this state will never be activated directly, users will always go to one of its child states instead. You must also specify a template containing a `<ui-view/>` directive, which will be populated with the child state's template.
```javascript
// url '/home', but you'll never see this state directly
.state('parent', {
    url: '/home',
    abstract: true,
    template: '<ui-view/>'
} )
```

2. Then do **one** of the following:

* Give the `'parent.index'` state an empty url. This will make it match the same url as its parent state url, because it appends nothing to the parent url.
```javascript
$stateProvider
    .state('parent', {url: '/home', abstract: true, template: '<ui-view/>'} )
    // ALSO url '/home', overriding its parent's activation
    .state('parent.index', {url: ''} )
```
However, using this method will cause usage of `ui-sref` to the `parent` state to fail. Reference by `href` to `#/parent` is recommended. See this [SO post](http://stackoverflow.com/questions/24969441/angularjs-ui-router-default-child-state-and-ui-sref) for additional information.

* Or if you want the `'parent.index'` url to be non-empty, then set up a redirect in your module.config using $urlRouterProvider:
```javascript
$urlRouterProvider.when('/home', '/home/index');
$stateProvider
    .state('parent', {url: '/home', abstract: true, template: '<ui-view/>'} )
    // url '/home/index'
    .state('parent.index', {url: '/index'} )
```

## How to: Use Require.js with UI-Router

How can I load ui-router with Require.js? Note: This is not lazy loading, for that see the section below.

The answer to this FAQ can be found here: https://github.com/angular-ui/ui-router/issues/479#issuecomment-26232775

## How to: Lazy load states

How can I load/define a state right when a user attempts to navigate to it?

Take a look at [Future States](http://christopherthielen.github.io/ui-router-extras/#/future) by UI-Router-Extras.

## How to: Make parallel states, aka sticky states, aka tabs

Take a look at [Sticky States](http://christopherthielen.github.io/ui-router-extras/#/sticky) by UI-Router-Extras.

## How to: Retain a state's state, scope, and scroll position

Take a look at [Deep State Redirect](http://christopherthielen.github.io/ui-router-extras/#/dsr) by UI-Router-Extras.

## How to: Make a trailing slash optional for all routes

How can I have my routes be activated when the url contains either a trailing slash or not?

Set [strictMode](http://angular-ui.github.io/ui-router/site/#/api/ui.router.util.$urlMatcherFactory#methods_strictmode) to false in your config block:

```javscript
$urlMatcherFactoryProvider.strictMode(false)
```

For older version of ui-router, add this snippet to your module's config function. It creates a rule on $urlRouterProvider that maps all urls that are missing a trailing slash to the same url but with the trailing slash appended. 

You'll need to specify all urls with a trailing slash if you use this method.

```javascript
$urlRouterProvider.rule(function ($injector, $location) {
    var path = $location.url();

    // check to see if the path already has a slash where it should be
    if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
        return;
    }

    if (path.indexOf('?') > -1) {
        return path.replace('?', '/?');
    }

    return path + '/';
});
```

**Note**: All routes in `app/scripts/app.js` must be redefined with trailing `/`. This means that routes such as `/things/:id` become `/things/:id/` as well.

## How to: Create rules to prevent access to a state

How can I have my states guarded by some logic that determines if a user is allowed to access that state? What if I also want to redirect them based on that logic?

Example: Uses the `data` object on the state config to define a rule function that will run logic against the user (here using an example service called $currentUser). The `$stateChangeStart` handler catches all state transition and performs this rule check before allowing the transition, potentially blocking it and/or redirecting to a different state.

```javascript
app.config(function($stateProvider) {
  $stateProvider.state('privatePage', {
    data: {
      rule: function(user) {
        // ...
      }
  });
});
app.run(function($rootScope, $state, $currentUser) {
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (!angular.isFunction(to.data.rule)) return;
    var result = to.data.rule($currentUser);

    if (result && result.to) {
      e.preventDefault();
      // Optionally set option.notify to false if you don't want 
      // to retrigger another $stateChangeStart event
      $state.go(result.to, result.params, {notify: false});
    }
  });
});
```

## How to: Prevent nested ui-sref objects from all firing/triggering

In some cases you'll want to nest elements that both (or more) contain a ui-sref attribute. If you click the deepest nested element it will trigger all the ui-srefs by default. To stop propogation do the following:
```html
    <div ui-sref="root.child" ng-click="$event.stopPropagation()">
        Child-detail
    </div>
```

## Issue: I'm getting a blank screen, and there are NO errors!

UI.Router intentionally does not log console debug errors out of the box. Add the following to your app in order to get some verbosity, and make debugging a hell of a lot easier:

```
app.run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});
```

If you're wondering why the errors aren't logged by default, see [Issue: JavaScript errors don't throw within resolve functions](Frequently-Asked-Questions#issue-javascript-errors-dont-throw-within-resolve-functions)

## Issue: My templates are not appearing / loading / showing

It is *very* common to forget to place a `<ui-view/>` in the parent state's template. If you are not using the more advanced `views` property then a template will always, by default, attempt to populate the ui-view in the parent state (for root states, this means index.html).

Often it's easy to remember to put the `<ui-view/>` in index.html but then when you start creating your template partials and declaring nested states, you will forget that your partials also need a `<ui-view/>` too if they will be loading a template from a child state.

## Issue: My assets and templates are not loading

This may be related to a nasty issue where assets and templates are not loading. It showed up during Angular 1.1.5 and is a bug in the core library. This tree helps you decide what response to take.

### Decision Tree:

**1)** _**Using Angular 1.1.5?**_

---`Yes:` See solution below.

---`No:` **2)** _**Using HTML5 urls?**_

--------------`No:` No base tag needed.

--------------`Yes:` **3)** _**Deploying to root?**_

--------------------------`Yes:` No base tag needed.

--------------------------`No:` See solution below.

### Solution

You'll need to either:

1. **Use absolute anchor urls (preferred)**
2. Add <base> tag to your index.html BUT all anchor urls will be broken for you :/

If you've chosen #2, then add the following tag to your index.html head:
```
<head>
    ...
    <base href="/"></base>
    ...
 </head>
```
... if your application is running at the root of your domain.

... and if your application is running in a subdirectory, specify that subdirectory (e.g. 'myapp'):
```
<head>
    ...
    <base href="/myapp/"></base>
    ...
 </head>
```

Bugs that were solved by this solution: [89](https://github.com/angular-ui/ui-router/issues/89), [200](https://github.com/angular-ui/ui-router/issues/200), [208](https://github.com/angular-ui/ui-router/issues/208), [250](https://github.com/angular-ui/ui-router/issues/250), [SO 17200231](http://stackoverflow.com/questions/17200231/how-to-set-default-url-route)

Other Resources:
* See bug in core: [issues/2799](https://github.com/angular/angular.js/issues/2799)
* Pull that fixes it: [pull/2969](https://github.com/angular/angular.js/pull/2969)

## Issue: Problems when using ng-view alongside ui-view

Don't do that.You can use some thing like ng-include to assemble your page.

## Issue: JavaScript errors don't throw within `resolve` functions

If you are having issues where a trivial error wasn't being caught because it was happening within the resolve function of a state, this is actually the intended behavior of promises per the [spec](http://wiki.commonjs.org/wiki/Promises/A). 

>If the callback throws an error, the returned promise will be moved to failed state.

The promise is rejected with the error. Additionally the [$stateChangeError](https://github.com/angular-ui/ui-router/wiki#state-change-events) event is triggered. It's very important to always set up your $stateChangeError handler early in the project to avoid headaches.

## Issue: `TypeError: Attempted to assign to readonly property` when running `grunt` tests
You were probably running PhantomJS >= 1.9.2 and the script under test is producing DOM exceptions. Please refer to https://github.com/angular/angular.js/commit/7e916455b36dc9ca4d4afc1e44cade90006d00e3 and fix your angular-mock.js .

## Issue: Firefox is throwing a `b.shift is not a function` error, other browsers are operating normally.
This occurs when you have a state named `watch`. Use a different name for your state.

## Issue: What is the difference between `$state.params` and `$stateParams`?
`$state.params` is a global representing the current state parameters for the current state, whereas `$stateParams` is a special local injectable that is created for each resolve or controller and populated only with the params for the particular state.