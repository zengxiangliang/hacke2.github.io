[[◄ Back (Nested States & Nested Views)|Nested States and Nested Views]] `      ` [[Next (URL Routing) ►|URL Routing]]		
		
You can name your views so that you can have more than one `ui-view` per template. Let's say you had an application state that needed to dynamically populate a graph, some table data and filters for the table like this:		
		
		
![Multiple Named Views Mockup](https://github.com/angular-ui/ui-router/wiki/MultipleNamedViewsExample.png)		
		
When setting multiple views, you need to use the `views` property on the state object. `views` is an object. 		
		
### Views override state's template properties		
If you define a `views` object, your state's `templateUrl`, `template` and `templateProvider` will be ignored. So in the case that you need a parent layout of these views, you can define an abstract state that contains a template, and a child state under the layout state that contains the 'views' object.		
		
### Example - Name Matching		
		
The property keys on `views` should match your view names, like so:		
```html		
<!-- index.html -->		
<body>		
  <div ui-view="filters"></div>		
  <div ui-view="tabledata"></div>		
  <div ui-view="graph"></div>		
</body>		
```		
```javascript		
$stateProvider		
  .state('report', {		
    views: {		
      'filters': { ... templates and/or controllers ... },		
      'tabledata': {},		
      'graph': {},		
    }		
  })		
```		
Then each view in `views` can set up its own templates (`template`, `templateUrl`, `templateProvider`) and controllers (`controller`, `controllerProvider`).		
```javascript		
$stateProvider		
  .state('report',{		
    views: {		
      'filters': {		
        templateUrl: 'report-filters.html',		
        controller: function($scope){ ... controller stuff just for filters view ... }		
      },		
      'tabledata': {		
        templateUrl: 'report-table.html',		
        controller: function($scope){ ... controller stuff just for tabledata view ... }		
      },		
      'graph': {		
        templateUrl: 'report-graph.html',		
        controller: function($scope){ ... controller stuff just for graph view ... }		
      }		
    }		
  })		
```		
		
### View Names - Relative vs. Absolute Names		
Behind the scenes, every view gets assigned an absolute name that follows a scheme of `viewname@statename`, where `viewname` is the name used in the view directive and state name is the state's absolute name, e.g. `contact.item`. You can also choose to write your view names in the absolute syntax. 		
		
For example, the previous example could also be written as:		
		
```javascript		
  .state('report',{		
    views: {		
      'filters@': { },		
      'tabledata@': { },		
      'graph@': { }		
    }		
  })		
```		
Notice that the view names are now specified as absolute names, as opposed to the relative name. It is targeting the 'filters', 'tabledata', and 'graph' views located in the root unnamed template. Since it's unnamed, there is nothing following the '@'. The root unnamed template is your index.html. 		
		
Absolute naming lets us do some powerful view targeting. [Remember! With power comes responsibility](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#scope-inheritance-by-view-hierarchy-only). Let's assume we had several templates set up like this (this example is not realistic, it's just to illustrate view targeting):

```html		
<!-- index.html (root unnamed template) -->		
<body ng-app>		
<div ui-view></div> <!-- contacts.html plugs in here -->		
<div ui-view="status"></div>		
</body>		
```		
		
```html		
<!-- contacts.html -->		
<h1>My Contacts</h1>		
<div ui-view></div>		
<div ui-view="detail"></div>		
```		
		
```html		
<!-- contacts.detail.html -->		
<h1>Contacts Details</h1>		
<div ui-view="info"></div>		
```		
Let's look at the various views you could target from within the `contacts.detail` state. Remember that if an `@` is used then the view path is considered absolute:		
```javascript		
$stateProvider		
  .state('contacts', {		
    // This will get automatically plugged into the unnamed ui-view 		
    // of the parent state template. Since this is a top level state, 		
    // its parent state template is index.html.		
    templateUrl: 'contacts.html'   		
  })		
  .state('contacts.detail', {		
    views: {		
        ////////////////////////////////////		
        // Relative Targeting             //		
        // Targets parent state ui-view's //		
        ////////////////////////////////////		
		
        // Relatively targets the 'detail' view in this state's parent state, 'contacts'.		
        // <div ui-view='detail'/> within contacts.html		
        "detail" : { },            		
		
        // Relatively targets the unnamed view in this state's parent state, 'contacts'.		
        // <div ui-view/> within contacts.html		
        "" : { }, 		
		
        ///////////////////////////////////////////////////////		
        // Absolute Targeting using '@'                      //		
        // Targets any view within this state or an ancestor //		
        ///////////////////////////////////////////////////////		
		
        // Absolutely targets the 'info' view in this state, 'contacts.detail'.		
        // <div ui-view='info'/> within contacts.detail.html		
        "info@contacts.detail" : { }		
		
        // Absolutely targets the 'detail' view in the 'contacts' state.		
        // <div ui-view='detail'/> within contacts.html		
        "detail@contacts" : { }		
		
        // Absolutely targets the unnamed view in parent 'contacts' state.		
        // <div ui-view/> within contacts.html		
        "@contacts" : { }		
		
        // absolutely targets the 'status' view in root unnamed state.		
        // <div ui-view='status'/> within index.html		
        "status@" : { }		
		
        // absolutely targets the unnamed view in root unnamed state.		
        // <div ui-view/> within index.html		
        "@" : { } 		
  });		
```		
		
You can see how this ability to not only set multiple views within the same state but ancestor states could become a meritable playground for a developer :).		
		
[[◄ Back (Nested States & Nested Views)|Nested States and Nested Views]] `      ` [[Next (URL Routing) ►|URL Routing]]		