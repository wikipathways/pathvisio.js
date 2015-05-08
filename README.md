pvjs-2.3.5
====================

JavaScript-based diagram viewer (implemented) and editor (in-progress) intended for biological pathways. It uses SVG and HTML for rendering, the [Mithril](http://lhorie.github.io/mithril/) framework for code organization and [BridgeDb](http://bridgedb.org/) for biological entity reference queries.

Demo
====

* [gh-pages](http://wikipathways.github.io/pvjs/)

How To Add It To Your Site
===================
You can loading it with either one of the two options below: HTML Element or Script.
It's as simple as referencing the pvjs JavaScript bundle in your HTML document:

## Load Using [Custom HTML Element](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/)

```HTML
<wikipathways-pvjs
    alt="WP525 Biological Pathway"
    src="http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=gpml&pwTitle=Pathway:WP525"
    display-errors="true"
    display-warnings="true"
    fit-to-container="true">
</wikipathways-pvjs>

<script src="http://wikipathways.github.io/pvjs/lib/pvjs/pvjs-2.3.5.bundle.min.js"></script>
```

## Load Using Script

First reference the pvjs JavaScript bundle in your HTML document:

```HTML
<script src="http://wikipathways.github.io/pvjs/lib/pvjs/pvjs-2.3.5.bundle.min.js"></script>
```

If you have jQuery, then you may do:

```js
$('#pvjs-container').pvjs({
  sourceData: [
    // at least one item required
    {
      uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=gpml&pwTitle=Pathway:WP525',
      fileType:'gpml' // generally will correspond to filename extension
    },
    {
      uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP525',
      fileType:'png'
    }
  ]
});
```

If you don't have jQuery and do not want to add it, then you may call `pvjs` directly and pass two arguments: container selector and options object.

```js
pvjs('#pvjs-container', {
  sourceData: [
    // at least one item required
    {
      uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=gpml&pwTitle=Pathway:WP525',
      fileType:'gpml' // generally will correspond to filename extension
    },
    {
      uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP525',
      fileType:'png'
    }
  ]
});
```

How To Get Involved
===================

A. Fork and clone pvjs. If you've already done this, skip ahead to Step B. Otherwise:

Fork the [WikiPathways repo for pvjs](https://github.com/wikipathways/pvjs/fork) by clicking the "Fork" button on the upper right. Github will create a fork of pvjs for you and take you to your newly created fork. On your newly created fork, find the "HTTPS clone URL," copy it, open a terminal on your dev machine and enter the following command:

```
$ cd ~/Sites/ #or another directory of your choice
$ git clone https://github.com/YOUR-GITHUB-ACCOUNT/pvjs.git #replace with the HTTPS clone URL you copied
$ cd pvjs
```

B. Add the wikipathways pvjs repo as a remote named "wikipathways," if you have not already done so:

```
$ cd ~/Sites/pvjs/ #use the location where the pvjs directory is actually located on your computer
$ git remote add wikipathways https://github.com/wikipathways/pvjs.git
```

Pull latest code from wikipathways master branch of pvjs:

```
$ git pull wikipathways master
```

C. Install Node.js and all necessary plugin and modules

First install [Node.js](http://nodejs.org/).

Install grunt and bower `npm install -g grunt-cli bower`. The automatic tests perform an image diff to compare the present rendering of a test pathway with the last known good version. This image diff requires you to install [ImageMagick](http://www.imagemagick.org/).

Install [Phash dependencies](https://github.com/aaronm67/node-phash) depending on your system.

Than in console `cd` into project folder and install all necessary plugins:

```
npm install
bower install
```

D. Make Updates

You can edit any of the files in the [src directory](https://github.com/wikipathways/pvjs/tree/master/src):

```
$ cd ~/Sites/pvjs/src/ #update this to where the pvjs directory is actually located on your computer
```

To view your changes as you edit you have to run `grunt dev` in console and navigate your browser to [http://localhost:3000/test/](http://localhost:3000/test/):

```
$ cd ~/Sites/pvjs/src/test/ #update this to where the pvjs directory is actually located on your computer
```

The [README](https://github.com/wikipathways/pvjs/tree/master/test/README.md) in this directory includes information on how to view diagrams during development and how to run tests.

E. Send Us a Pull Request

* Visually inspect each of the test pathways from the test page, comparing your version with the current version to ensure your code produces the correct visual result in terms of styling, etc.
* Run the tests
* Commit your changes and push them to your github fork of pvjs
* Create a pull request to the wikipathways fork of pvjs:
```
wikipathways:master ... YOUR-GITHUB-ACCOUNT:master
```

For developers
==============

Components
----------
* Viewer
  - Notifications Plugin
  - Highlighter Plugin
  - DiffViewer Plugin
  - Annotations Panel
* Editor
* bridgedbjs

Available event messages
------------------------

Event messages are namespaced and may be called with namespace or without. Namespace is defined by a dot: `click.renderer`.
Triggering events without specifying a namespace will run both events with and without namespace (ex. trigger('click') will run both on('click') and on('click.renderer')).
Listening on events without a namespace will run hooks event if an event with namespace was triggered (ex. on('click') will run on both trigger('click') and trigger('click.renderer')).
In order to prevent running unwanted hooks it is better to namespace all events triggers and listeners.

List of available events through application (custom events may be added at any time):
* destroy.pvjs
* error.sourceData
* error.pvjson
* error.renderer
* rendered.renderer
* zoomed.renderer
* panned.renderer
* warning.renderer

Editor Plugin
-------------

Allows for updating the pvjson data.

[Documentation](https://github.com/wikipathways/pvjs/tree/master/src/editor)

Notifications Plugin
--------------------

Notifications plugin listens for warning and error messages and displays them as alert boxes.

### Usage

In order to add notifications to pvjs do:

1. Reference plugin's _JS_ and _CSS_ files or use bundle version of pvjs
2. Activate notifications for a given pvjs:

    ```js
    pvjsNotifications(pvjsInstance, {displayErrors: true, displayWarnings: true})
    ```

Highlighter Plugin
------------------

Highlighter plugin allows for highlighting pathway nodes, interactions, groups and other entities. It allows for selecting data nodes using autocomplete text input.

### Usage

```js
    $('#wikipathways-pvjs-1').pvjs({
      fitToContainer: true,
      sourceData: [
        // at least one item required
        {
          uri: '../input-data/WP525_73040.gpml',
          fileType: 'gpml' // generally will correspond to filename extension
        },
        {
          uri: 'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP1',
          fileType: 'biopax'
        },
        {
          uri: 'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP1',
          fileType: 'png'
        }
      ],
      displayErrors: true,
      displayWarnings: true,
      highlights: [
        {
          selector: 'ATFS-1',
          backgroundColor: 'yellow',
          borderColor: 'blue',
        },
        {
          selector: 'PHB-2',
          backgroundColor: 'white',
          borderColor: 'red',
        }
      ]
    });
```

<!---
To customize Highlighter pass arguments to its constructor:

```js
var hi = pvjsHighlighter(pathInstance, {
  displayInputField: true
, autocompleteLimit: 10
, styles: {
    fill: 'yellow'
  , 'fill-opacity': 0.2
  , stroke: 'orange'
  , 'stroke-width': '3px'
  , 'stroke-opacity': 1
  }
})
```
-->

To highlight or attenuate call corresponding API methods:

```js
// Highlight by ID
pathInstance.highlight('#e6e')
// Highlight by text label
pathInstance.highlight('Cholesterol')
// Highlight by xref
pathInstance.highlight('xref:12345')

// Attenuate by ID
pathInstance.attenuate('#e6e')
```

You can create highlight groups. This is useful if you want to namespace highlighters for easier attenuation.

```js
// Default group
pathInstance.highlight('#e6e')

// Group g1
pathInstance.highlight('#e7e', 'g1')
pathInstance.highlight('#e8b', 'g1')
pathInstance.highlight('#e9c', 'g1')

// One highlighting can be part of more groups
pathInstance.highlight('#e7e', 'g2')

// Attenuate #e7e only if it is in group g2
pathInstance.attenuate('#e7e', 'g2')

// Attenuate all elements from group g1
pathInstance.attenuate(null, 'g1')
```

You may provide a custom style to your highlighting

```js
// Red fill, blue stroke
pathInstance.highlight('#e6e', null, {fill: 'red', stroke: 'blue'})
```

Difference Viewer Plugin (DiffViewer)
-------------------------------------

DiffViewer plugin allows to compare difference between 2 different versions of a pathway.

### Usage

First reference plugin's _JS_ and _CSS_ files or use bundle version of pvjs.

Highlighter should be instantiated before pvjs was rendered:

```js
$('#pvjs-container').pvjs({
  fitToContainer: true,
  manualRender: true,
  sourceData: [
    {
      uri: 'http://pointer.ucsf.edu/d3/r/data-sources/gpml.php?id=WP2806&rev=75308',
      fileType:'gpml'
    }
  ]
});

// Get first element from array of instances
pathInstance = $('#pvjs-container').pvjs('get').pop();

// Init difference viewer
pvjsDiffviewer(pathInstance, {
  sourceData: [
    {
      uri: 'http://pointer.ucsf.edu/d3/r/data-sources/gpml.php?id=WP2806',
      fileType:'gpml'
    }
  ]
});

// Call renderer
pathInstance.render();
```

Related
=======
This project is supported by the same community that maintains the Java-based pathway diagram editor [PathVisio](http://www.pathvisio.org/), but the codebases between pvjs and PathVisio-Java are entirely distinct. PathVisio-Java plugins will not work with pvjs.

License
=======

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.


Funding
=======
* The National Institute for General Medical Sciences [R01-GM100039](http://www.nigms.nih.gov/)
* The BioRange program of the Netherlands [Bioinformatics Centre](http://www.nbic.nl/)
* [University Maastricht](http://www.unimaas.nl/default.asp?taal=en): Broad Research Strategy Program Part 2 (BOS2)
