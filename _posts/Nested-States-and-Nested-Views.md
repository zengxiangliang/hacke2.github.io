[[◄ Back (State Manager)|Home]] `      ` [[Next (Multiple Named Views) ►|Multiple Named Views]]

### Methods for Nesting States

States can be nested within each other. There are several ways of nesting states:

1. Using 'dot notation'. For example `.state('contacts.list', {})`.
2. Use the [ui-router.stateHelper](https://github.com/marklagendijk/ui-router.stateHelper) to build states from a nested state tree. *Courtesy of @marklagendijk.*
3. Using the `parent` property with the parent name as **string**. For example: `parent: 'contacts'`
4. Using the `parent` property with the parent **object**. For example `parent: contacts` (where 'contacts' is a stateObject)

#### Dot Notation

You can use dot syntax to infer your hierarchy to the $stateProvider. Below, `contacts.list` becomes a child of `contacts`. 
```javascript
$stateProvider
  .state('contacts', {})
  .state('contacts.list', {});
```

#### stateHelper module

This is a 3rd party module created by @marklagendijk. So you have to include it in **addition** to ui-router. [Visit the stateHelper repo to learn more](https://github.com/marklagendijk/ui-router.stateHelper)

```javascript
angular.module('myApp', ['ui.router', 'ui.router.stateHelper'])
  .config(function(stateHelperProvider){
    stateHelperProvider.state({
      name: 'root',
      templateUrl: 'root.html',
      children: [
        {
          name: 'contacts',
          templateUrl: 'contacts.html',
          children: [
            {
              name: 'list',
              templateUrl: 'contacts.list.html'
            }
          ]
        },
        {
          name: 'products',
          templateUrl: 'products.html',
          children: [
            {
              name: 'list',
              templateUrl: 'products.list.html'
            }
          ]
        }
      ]
    });
  });
```

#### Parent Property using State Name String

Alternately, you can specify the parent of a state via the `parent` property.
```javascript
$stateProvider
  .state('contacts', {})
  .state('list', {
    parent: 'contacts'
  });
```

#### Object-based States
If you aren't fond of using string-based states, you can also use object-based states. The `name` property goes _in_ the object and the `parent` property **must** be set on all child states, like this:

```javascript
var contacts = { 
    name: 'contacts',
    templateUrl: 'contacts.html'
}
var contactsList = { 
    name: 'list',
    parent: contacts,
    templateUrl: 'contacts.list.html'
}

$stateProvider
  .state(contacts)
  .state(contactsList)
```

You can usually reference the object directly when using other methods and property comparisons:

```javascript
$state.transitionTo(states.contacts);
$state.current === states.contacts;
$state.includes(states.contacts)
```

### Registering States Order
You can register states in any order and across modules. You can register children before the parent state exists. It will queue them up and once the parent state is registered then the child will be registered.

### Parent MUST Exist
If you register only a single state, like `contacts.list`, you MUST define a state called `contacts` at some point, or else no states will be registered. The state `contacts.list` will get queued until `contacts` is defined. You will not see any errors if you do this, so be careful that you define the parent in order for the child to get properly registered.

### Naming Your States

No two states can have the same name. When using dot notation the `parent` is inferred, but this doesn't change the name of the state. When explicitly providing a parent using the `parent` property, state names still must be unique. For example, you can't have two different states named "edit" even if they have different parents.  

### Nested States & Views
When the application is in a particular state—when a state is "active"—all of its ancestor states are implicitly active as well. Below, when the "contacts.list" state is active, the "contacts" state is implicitly active as well, because it's the parent state to "contacts.list". 

Child states will load their templates into their parent's `ui-view`. 

Full Plunkr Here: http://plnkr.co/edit/7FD5Wf?p=preview
```javascript
$stateProvider
  .state('contacts', {
    templateUrl: 'contacts.html',
    controller: function($scope){
      $scope.contacts = [{ name: 'Alice' }, { name: 'Bob' }];
    }
  })
  .state('contacts.list', {
    templateUrl: 'contacts.list.html'
  });

function MainCtrl($state){
  $state.transitionTo('contacts.list');
}
```
```html
<!-- index.html -->
<body ng-controller="MainCtrl">
  <div ui-view></div>
</body>
```
```html
<!-- contacts.html -->
<h1>My Contacts</h1>
<div ui-view></div>
```
```html
<!-- contacts.list.html -->
<ul>
  <li ng-repeat="contact in contacts">
    <a>{{contact.name}}</a>
  </li>
</ul>
```

#### What Do Child States Inherit From Parent States?

Child states **DO** inherit the following from parent states:
* [Resolved dependencies via `resolve`](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#wiki-inherited-resolved-dependencies)
* [Custom `data` properties](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#wiki-inherited-custom-data)

Nothing else is inherited (no controllers, templates, url, etc). However, children of [abstract states](https://github.com/angular-ui/ui-router/wiki/Nested-States-and-Nested-Views#abstract-states) do inherit the [`url` property of their parent as a prefix of their own `url`](https://github.com/angular-ui/ui-router/wiki/Nested-States-and-Nested-Views#abstract-state-usage-examples).

#### Inherited Resolved Dependencies

New in version 0.2.0

Child states will inherit resolved dependencies from parent state(s), which they can overwrite. You can then inject resolved dependencies into the controllers and resolve functions of child states.

```javascript
$stateProvider.state('parent', {
      resolve:{
         resA:  function(){
            return {'value': 'A'};
         }
      },
      controller: function($scope, resA){
          $scope.resA = resA.value;
      }
   })
   .state('parent.child', {
      resolve:{
         resB: function(resA){
            return {'value': resA.value + 'B'};
         }
      },
      controller: function($scope, resA, resB){
          $scope.resA2 = resA.value;
          $scope.resB = resB.value;
      }
```

**NOTE**: 
 - The `resolve` keyword MUST be relative to `state` not `views` (in case you use multiple views).
 - If you want a child resolve to wait for a parent resolve, you should inject the parent resolve keys into the child.  (This behavior is [different in ui-router 1.0](https://ui-router.github.io/guide/ng1/migrate-to-1_0#lazy-resolves)).

#### Inherited Custom Data
Child states will inherit data properties from parent state(s), which they can overwrite. 

```javascript
$stateProvider.state('parent', {
      data:{
         customData1:  "Hello",
         customData2:  "World!"
      }
   })
   .state('parent.child', {
      data:{
         // customData1 inherited from 'parent'
         // but we'll overwrite customData2
         customData2:  "UI-Router!"
      }
   });

$rootScope.$on('$stateChangeStart', function(event, toState){ 
    var greeting = toState.data.customData1 + " " + toState.data.customData2;
    console.log(greeting);

    // Would print "Hello World!" when 'parent' is activated
    // Would print "Hello UI-Router!" when 'parent.child' is activated
})
```

#### Scope Inheritance by View Hierarchy Only
Keep in mind that scope properties only inherit down the state chain if the views of your states are nested. Inheritance of scope properties has nothing to do with the nesting of your states and everything to do with the nesting of your views (templates). 

It is [entirely possible](https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views#view-names---relative-vs-absolute-names) that you have nested states whose templates populate ui-views at various non-nested locations within your site. In this scenario you cannot expect to access the scope variables of parent state views within the views of children states.

#### View Inherited Resolved Dependencies

Views **may** inherit resolved dependencies from the state that they belong to,
but **may not** inherit those of their sibling views.

```javascript
$stateProvider.state('myState', {
  resolve:{
     resMyState:  function(){
        return { value: 'mystate' };
     }
  },
  views: {
    'foo@myState': {
      templateUrl: 'mystate-foo.html',
      controller: function($scope, resMyState, resFoo){ 
        /* has access to resMyState and resFoo,
           but *not* resBar */ 
      },
      resolve: {
        resFoo: function() {
          return { value: 'foo' };
        }
      },
    },
    'bar@myState': {
      templateUrl: 'mystate-bar.html',
      controller: function($scope, resMyState, resBar){ 
        /* has access to resMyState and resBar,
           but *not* resFoo */ 
      },
      resolve: {
        resBar: function() {
          return { value: 'bar' };
        },
      },
    },
  },
});
```

### Abstract States
An abstract state can have child states but can not get activated itself. An 'abstract' state is simply a state that can't be transitioned to. It is activated implicitly when one of its descendants are activated.

Some examples of how you might use an abstract state are:
* To prepend a [`url`](https://github.com/angular-ui/ui-router/wiki/URL-Routing#url-routing-for-nested-states) to all child state urls.
* To insert a [`template`](https://github.com/angular-ui/ui-router/wiki#templates) with its own `ui-view(s)` that its child states will populate.
    * Optionally assign a `controller` to the template. The controller **must** pair to a template. 
    * Additionally, inherit $scope objects down to children, just understand that this happens via the [view hierarchy](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#scope-inheritance-by-view-hierarchy-only), not the state hierarchy.
* To [provide resolved dependencies](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-resolved-dependencies) via `resolve` for use by child states.
* To [provide inherited custom data](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data) via `data` for use by child states or an event listener.
* To run an `onEnter` or `onExit` function that may modify the application in someway.
* Any combination of the above.

**Remember:** Abstract states still need their own `<ui-view/>` for their children to plug into. So if you are using an abstract state just to prepend a url, set resolves/data, or run an onEnter/Exit function, then you'll additionally need to set `template: "<ui-view/>"`.

#### Abstract State Usage Examples:

**To prepend url to child state urls**
```javascript
$stateProvider
    .state('contacts', {
        abstract: true,
        url: '/contacts',

        // Note: abstract still needs a ui-view for its children to populate.
        // You can simply add it inline here.
        template: '<ui-view/>'
    })
    .state('contacts.list', {
        // url will become '/contacts/list'
        url: '/list'
        //...more
    })
    .state('contacts.detail', {
        // url will become '/contacts/detail'
        url: '/detail',
        //...more
    })
```

**To insert a template with its own `ui-view` for child states to populate**
```javascript
$stateProvider
    .state('contacts', {
        abstract: true,
        templateUrl: 'contacts.html'
    })
    .state('contacts.list', {
        // loaded into ui-view of parent's template
        templateUrl: 'contacts.list.html'
    })
    .state('contacts.detail', {
        // loaded into ui-view of parent's template
        templateUrl: 'contacts.detail.html'
    })
```
```html
<!-- contacts.html -->
<h1>Contacts Page</h1>
<div ui-view></div>
```

**Combination**

Shows prepended url, inserted template, paired controller, and inherited $scope object.

Full Plunkr Here: http://plnkr.co/edit/gmtcE2?p=preview
```javascript
$stateProvider
    .state('contacts', {
        abstract: true,
        url: '/contacts',
        templateUrl: 'contacts.html',
        controller: function($scope){
            $scope.contacts = [{ id:0, name: "Alice" }, { id:1, name: "Bob" }];
        }    		
    })
    .state('contacts.list', {
        url: '/list',
        templateUrl: 'contacts.list.html'
    })
    .state('contacts.detail', {
        url: '/:id',
        templateUrl: 'contacts.detail.html',
        controller: function($scope, $stateParams){
          $scope.person = $scope.contacts[$stateParams.id];
        }
    })
```

```html
<!-- contacts.html -->
<h1>Contacts Page</h1>
<div ui-view></div>
```

```html
<!-- contacts.list.html -->
<ul>
    <li ng-repeat="person in contacts">
        <a ng-href="#/contacts/{{person.id}}">{{person.name}}</a>
    </li>
</ul>
```

```html
<!-- contacts.detail.html -->
<h2>{{ person.name }}</h2>
```

[[◄ Back (State Manager)|Home]] `      ` [[Next (Multiple Named Views) ►|Multiple Named Views]]