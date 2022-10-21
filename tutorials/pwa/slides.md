---
layout: remark_slideshow
title:  "Progressive Web App Tutorial"
description: Work-in-progress tutorial on the basics of progressive web apps (and HTML).
katex: true
---

<script>
    console.log('replacing...')
    document.querySelectorAll('#long_title, #short_title').forEach(elem => elem.innerHTML = 'PWA Workshop');
</script>

{% assign imgs_dir = "/tutorials/pwa/imgs" | relative_url %}
{% assign csdir = "/tutorials/pwa/cheatsheet" | relative_url %}

<style>
.left-column70 {
    width: 70%;
    float: left;
}
.right-column30 {
    width: 30%;
    float: right;
}
.left-column50 {
    width: 50%;
    float: left;
}
.right-column49 {
    width: 49%;
    float: right;
}
code {
    border: 1px solid lightgray;
    border-radius: 2px;
}
</style>

<div markdown=0>

# Reference sheets
- [web manifest]({{csdir}}/web.pdf)
- [HTML]({{csdir}}/html.pdf)
- [JavaScript]({{csdir}}/js.pdf)
- [CSS]({{csdir}}/css.pdf)

---

# Plan
 * Slides (30-45 mins)
    * Learn what a PWA is.
    * *Quick* introduction to HTML/CSS.
    * What does it take to make a web app installable?
    * Making an example PWA
 * Live coding (20-30 mins)
    * Making the example app better.
 * Work time and questions (30-40 mins)


{% comment %}
---

# What is a progressive web app (PWA)?

.left-column70[
According to [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps),
> Progressive Web Apps (PWAs) are web apps that use service workers, manifests, and other web-platform features in combination with progressive enhancement to give users an experience on par with native apps.
>
> <cite>— Mozilla Developer Networks</cite>

In short, PWAs are websites that act like native apps (e.g. are installable, display notifications, etc.), *while still working properly on browsers that don't support newer PWA features*.
]

.right-column30[![Drawing of a phone with a notification and an 'install me' popup]({{ imgs_dir }}/pwa_justinstalled.svg)]

{%endcomment%}

---

# What is a progressive web app (PWA)?

.left-column70[
- Installable ![Download icon]({{imgs_dir}}/download_icon.svg)
- Looks/acts like a native app <img src="{{imgs_dir}}/pwa_notoolbar.svg" alt="Phone OS toolbar with arrow pointing that says 'no browser toolbar'" height="58px"/>
- Can also be used like a traditional website in older browsers ![Logo of an older browser]({{imgs_dir}}/old_browser_logo.svg)
]

.right-column30[![Drawing of a phone with a notification and an 'install me' popup]({{ imgs_dir }}/pwa_justinstalled.svg)]

???

Definition source: [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

<img alt="A screenshot of an example progressive web app" src="{{imgs_dir}}/example-pwa.svg" style="max-height: 600px;"/>

---

# HTML

(Be sure to collect an HTML and JavaScript "cheat sheet" if you haven't already!)

- Determines a website's content (and behavior, to a degree.)
- Containers are called tags and look like this `<p>Content of the paragraph container.</p>`.
- Content inside of the `<head></head>` container generally determines website behavior/display.

.center[![]({{imgs_dir}}/html.svg)]

???

Participants should be given a "cheat-sheet" with HTML syntax.

---

# HTML — Examples

.left-column50[
Example 1:
```html
<!DOCTYPE html>
<html>
    <head><title>The website's title</title></head>
    <body>
        <p>This is a paragraph.</p>
    </body>
</html>
```
]

.right-column49[
Example 2:
```html
<!DOCTYPE html>
<html>
    <head>
        <title>The website's title</title>
        <script>
            if (Math.random() > 0.5) {
                alert('Show an alert box');
            }
        </script>
    </head>
    <body>
        <p>This is a paragraph.</p>
        <button>This is a button</button>
    </body>
</html>
```
]

Questions?

???
Ask the room for volunteers &mdash; have someone walk through the HTML document based on the cheat sheet.
If not, go through line-by-line.

---
{% capture css_header %}<span style="font-family: 'Tex Gyre Bonum', serif; font-weight: bold;">C</span><span style="font-family: 'Tex Gyre Adventor', sans; transform: scale(0.9, 1) rotate(6deg); display: inline-block;">S</span>S{%endcapture%}
# {{css_header}}

 * Changes how things on a website look.
 * Decides what to style based on *selectors*.
    * E.g. `p` selects all elements with tag `p` and `a-paragraph` selects all elements with class `a-paragraph`.

.left-column50[
**Example 1**:
```html
<!DOCTYPE html>
<html>
    <body>
        <p>A paragraph</p>
        <style>
            p {
                color: red;
            }
        </style>
    </body>
</html>
```
]
.right-column49[
**Example 2**:
```html
<!DOCTYPE html>
<html>
    <body>
        <p class='a-paragraph'>A paragraph</p>
        <style>
            .a-paragraph {
                color: red;
            }
        </style>
    </body>
</html>
```
]

---
# {{css_header}}

**Example 3**:
```html
<!DOCTYPE html>
<html>
    <body>
        <h1 class='css-header'>
            <span class='c'>C</span><span class='s1'>S</span><span class='s2'>S</span>
        </h1>
        <style>
            .css-header > .c {
                font-family: serif;
                font-weight: bold;
            }
            .css-header > .s1 {
                font-family: sans;

                transform: scale(0.9, 1) rotate(6deg);

                /* inline-block turns off text wrapping — the browser can't transform text that could wrap between lines. */
                display: inline-block;
            }
        </style>
    </body>
</html>
```


---
# JavaScript

 - Website _behavior_.

**index.html**:
```html
<!DOCTYPE html>
<html>
    <body>
        <div>
            <span id='counter'></span>
            <button id='add-to-counter'>+</button>
        </div>
    </body>

    <!-- Include a script from a file. -->
    <script src='counter.js'></script>
</html>
```

???
 - If we want to be able to import other scripts, we can use [module scripts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (scripts with imports).
 - We could also use a bundler like webpack or rollup.

---

**counter.js**:
```js
const counterDisplay = document.querySelector(`#counter`);
const incrementButton = document.querySelector(`#add-to-counter`);

const initialCounterValue = 0
counterDisplay.innerText = initialCounterValue;

incrementButton.onclick = () => {
    const previousValue = parseInt(counterDisplay.innerText);
    const newValue = previousValue + 1;
    counterDisplay.innerText = newValue;
};
```

![The counter running in a web-browser. The count is displayed and a plus button displays to the right.]({{ imgs_dir }}/counter-display.png)

---

# Let's make the counter value persistent!

**counter.js**:
```js
const counterDisplay = document.querySelector(`#counter`);
const incrementButton = document.querySelector(`#add-to-counter`);

// ?? <- if the thing on the left is undefined or null, return the thing on the right.
// E.g. 3 ?? 6 == 3, but null ?? 6 == 6.
const initialCounterValue = localStorage.getItem('counter-value') ?? '0';
counterDisplay.innerText = initialCounterValue;

incrementButton.onclick = () => {
    const previousValue = parseInt(counterDisplay.innerText);
    const newValue = previousValue + 1;
    counterDisplay.innerText = newValue;

    localStorage.setItem('counter-value', newValue);
};
```

???

Above, we use `localStorage.getItem` and `localStorage.setItem` to persistently store the counter's value.
Read more about these functions on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

If you want to share information between users of the app, consider using a service like [Firebase Firestore](https://firebase.google.com/docs/web/setup).

---

# Let's give it an icon!

<img src="{{ imgs_dir }}/counter-icon.svg" alt="Counter icon" style="background-color: black; padding: 8px; border-radius: 6px; max-width: 400px; border: 1px solid black;"/>

Make an SVG image (or use this one) and save it as `icon.svg`.

???

Here's an SVG icon I made with `js-draw` (an online drawing program). To make a more professional icon, I suggest a tool like [Inkscape](https://inkscape.org/).

---

Depending on how you make the SVG image, you may need to manually adjust the height/width. We want `height=512` and `width=512`.
<img src="{{imgs_dir}}/editing-height-width.png" alt="Image open in ViM, height and width changed and highlighted" style='max-width: 100%; margin-top: 100px;'/>

???

You might need to change the image width/height depending on how you made it &mdash; we'll need it to be a square of a specific size.

---

# Adding the icon
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Counter</title>

        <!-- Set the icon! -->
        <link rel='icon' href='./icon.svg'/>

        <meta charset='utf-8'/>
    </head>
    <body>
        <div>
            <span id='counter'></span>
            <button id='add-to-counter'>+</button>
        </div>
    </body>

    <script src='counter.js'></script>
</html>
```

---

<img src="{{imgs_dir}}/counter-window-with-icon.png" alt="counter window with the icon showing up in the titlebar!"/>

---

# Let's test on mobile!

![]({{imgs_dir}}/very-small-on-mobile.png)

Why is everything so small???

---

# Making the UI scale properly

**index.html**:
```html
<!DOCTYPE html>
<html>
    <html>
    <head>
        <link rel='icon' href='./icon.svg'/>
        <meta charset='utf-8'/>
        <title>Counter</title>

        <!-- Set the window's width to the device-width to prevent the UI from being small! -->
        <meta name='viewport' content='width=device-width'/>
    </head>
    <body>
        <div><span id='counter'></span><button id='add-to-counter'>+</button></div>
    </body>
    <script src='counter.js'></script>
</html>
```

We need to set the viewport!

---

# Making the UI scale properly

**index.html**:
```html
<!DOCTYPE html>
<html>
    <head>
        <link rel='icon' href='./icon.svg'/>
        <meta charset='utf-8'/>
        <title>Counter</title>

        <!-- Set the window's width to the device-width to prevent the UI from being small! -->
        <meta name='viewport' content='width=device-width,initial-scale=1.0'/>
    </head>
    <body>
        <div><span id='counter'></span><button id='add-to-counter'>+</button></div>
    </body>
    <script src='counter.js'></script>
</html>
```

Let's also disable pinch zooming and ensure the zoom starts at the correct level when rotating the screen.

???

Adding `initial-scale=1.0` [works around an iPhone zoom-on-screen-rotate bug](https://css-tricks.com/probably-use-initial-scale1/) and perhaps other issues.

<!--

Why isn't there an icon when we add it to the homescreen on an iOS device?

==TODO==

-->

---

# Let's make it installable!

To do this, we need to add a web app manifest and a service worker. Let's start with the manifest:

**manifest.json**:
```json
{
    "short_name": "Counter",
    "name": "Counter App",
    "icons": [
        {
            "src": "./icon.svg",
            "type": "image/svg+xml",
            "sizes": "512x512"
        }
    ],
    "start_url": "./index.html",
    "background_color": "#ccaa00",
    "theme_color": "purple",

    "display": "standalone"
}
```

???

https://web.dev/add-manifest/

Adding 
```json
    "purpose": "any maskable"
```
to the icon allows Android devices to display it over a custom background. 
See also [this web.dev article](https://web.dev/add-manifest/#icons).

---

Now, let's make it possible for the browser to find the manifest. Add `<link rel="manifest" href="./manifest.json"/>` to `index.html`.

**index.html**:
```html
<!DOCTYPE html>
<html>
    <head>
        <link rel='manifest' href='./manifest.json'/>

        <meta charset='utf-8'/>
        <meta name='viewport' content='width=device-width,initial-scale=1.0'/>
        <link rel='icon' href='./icon.svg'/>

        <title>Counter</title>
    </head>
    <body>
        <div><span id='counter'></span><button id='add-to-counter'>+</button></div>
    </body>
    <script src='counter.js'></script>
</html>
```

---

# Let's run it through Lighthouse.

<img alt="Lighthouse start tab in Microsoft Edge developer tools. All checkboxes except for PWA, navigation (timespan) and Mobile, are unchecked." src="{{imgs_dir}}/lighthouse-pwa-check-1.png" style='max-height: 560px;'/>

???

Lighthouse is available in most (all?) Chromium-based desktop browsers. Above, it's shown in Microsoft Edge.

---

# Let's run it through Lighthouse.

<img alt="Lighthouse check results: Our app isn't installable yet -- it needs a service worker" src="{{imgs_dir}}/lighthouse-pwa-check-2.png" style='max-height: 560px;'/>


---

# Let's run it through Lighthouse.

<img alt="Expanding the box that lists the reason for not being installable: No matching service worker detected. You may need to reload the page, or check that the scope of the service worker for the current page encloses the scope and start URL from the manifest." src="{{imgs_dir}}/lighthouse-pwa-check-3.png" style='max-height: 560px;'/>

---

# Adding a service worker

**sw.js**
```js
const cacheName = 'v1';

const fetchOrGetFromCache = async (event) => {
    const cache = await caches.open(cacheName);
    try {
        const fetched = await fetch(event.request.url);
        cache.put(event.request, fetched.clone());

        return fetched;
    } catch (error) {
        console.warn('Unable to fetch from the internet. Error: ', error);
        return cache.match(event.request.url);
    }
};

self.addEventListener('fetch', event => {
	event.respondWith(fetchOrGetFromCache(event));
});
```

???

This service worker is largely taken from [js-draw](https://github.com/personalizedrefrigerator/js-draw/blob/main/docs/example/sw.js).

# See also
 - [MDN: CacheStorage#open](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open)
 - [More on caching with Service Workers](https://web.dev/service-worker-caching-and-http-caching/)
 - Workbox: A service worker library: [Service worker documentation](https://developer.chrome.com/docs/workbox/caching-strategies-overview/)

---

# Breaking down the service worker

```js
// A unique name for the cache we're using. 
const cacheName = 'counterCache-v1';

const fetchOrGetFromCache = async (event) => {
    const cache = await caches.open(cacheName);
    try {
        const fetched = await fetch(event.request.url);
        cache.put(event.request, fetched.clone());

        return fetched;
    } catch (error) {
        console.warn('Unable to fetch from the internet. Error: ', error);
        return cache.match(event.request.url);
    }
};

self.addEventListener('fetch', event => {
	event.respondWith(fetchOrGetFromCache(event));
});
```

---

# Breaking down the service worker

```js
const cacheName = 'counterCache-v1';

const fetchOrGetFromCache = async (event) => {
    const cache = await caches.open(cacheName);
    try {
        const fetched = await fetch(event.request.url);
        cache.put(event.request, fetched.clone());

        return fetched;
    } catch (error) {
        console.warn('Unable to fetch from the internet. Error: ', error);
        return cache.match(event.request.url);
    }
};

const onFetch = (event) => {
	event.respondWith(fetchOrGetFromCache(event));
};
// Call onFetch when the browser tries to load a resource (e.g an image,
// a script, index.html, etc.)
self.addEventListener('fetch', onFetch);
```

---

# Breaking down the service worker

```js
// A unique name for the cache we're using. 
const cacheName = 'counterCache-v1';

// async: Return something that we can wait for.
// i.e. await fetchOrGetFromCache(evt) **waits**
//      for fetchOrGetFromCache to finish while
//      fetchOrGetFromCache(evt) with no await does not.
const fetchOrGetFromCache = async (event) => {
    const cache = await caches.open(cacheName);
    try {
        const fetched = await fetch(event.request.url);
        cache.put(event.request, fetched.clone());

        return fetched;
    } catch (error) {
        console.warn('Unable to fetch from the internet. Error: ', error);
        return cache.match(event.request.url);
    }
};

self.addEventListener('fetch', event => {
	event.respondWith(fetchOrGetFromCache(event));
});
```


---

# Breaking down the service worker

```js
// A unique name for the cache we're using. 
const cacheName = 'counterCache-v1';

const fetchOrGetFromCache = async (event) => {
    // await: Wait for caches.open to finish. Open our cache.
    const cache = await caches.open(cacheName);
    try {
        // fetch: Get the contents of the URL from the internet
        const fetched = await fetch(event.request.url);
        cache.put(event.request, fetched.clone());

        return fetched;
    } catch (error) {
        console.warn('Unable to fetch from the internet. Error: ', error);
        return cache.match(event.request.url);
    }
};

self.addEventListener('fetch', event => {
	event.respondWith(fetchOrGetFromCache(event));
});
```

---

# Registering the service worker

```html
<!DOCTYPE html>
<html>
    <head>
        ...
    </head>
    <body>
        <div><span id='counter'></span><button id='add-to-counter'>+</button></div>
    </body>
    <script src='counter.js'></script>

    <!-- Register the service worker -->
    <script>
        const pathToServiceWorker = './sw.js';
        navigator.serviceWorker.register(pathToServiceWorker).catch(err => {
            console.error('Unable to register service worker:', err);
        });
    </script>
</html>
```

---

# Error handling

`navigator.serviceWorker` can be `null` on older browsers. Let's try to handle that!

```html
<script>
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('./sw.js').catch(err => {
            console.error('Unable to register service worker:', err);
        });
    }
</script>
```

???

Alternatively, using JavaScript `?` syntax,

```js
<script>
    navigator.serviceWorker?.register('./sw.js')?.catch(err => {
        console.error('Unable to register service worker:', err);
    });
</script>
```

A `?` means "don't call the method if the left side of `?` is `null` or `undefined`". For example, `(null)?.foo()` does nothing.

---

# Installing it!

<img alt="Click the icon in the browser toolbar to install the app." src="{{imgs_dir}}/install-counter-app.png" style="width: 98%;"/>

???

Not all browsers support PWA installation. Firefox, for example, does not.

---

# Running the PWA check again...

We need special `PNG` icons!

<img alt="Lighthouse: There are still issues" src="{{imgs_dir}}/lighthouse-pwa-check-4.png" style='max-height: 560px;'/>

---

# PNG icons and iOS fixes

Create a 192-px PNG icon for the app and add it to the main HTML file.

**index.html**:
```html
<!DOCTYPE html>
<html>
    <head>
        <link rel='apple-touch-icon' href='./icon-192.png'/>
        <meta name='theme-color' content='#ff0000'/>

        <link rel='manifest' href='./manifest.json'/>
        <meta charset='utf-8'/>
        <meta name='viewport' content='width=device-width,initial-scale=1.0'/>
        <link rel='icon' href='./icon.svg'/>

        <title>Counter</title>
    </head>
    <body>
        <div><span id='counter'></span><button id='add-to-counter'>+</button></div>
    </body>
    <script src='counter.js'></script>
</html>
```
---

# How do I install a PWA on iOS?

Share sheet -> Add to homescreen

<img alt="" src="{{imgs_dir}}/ios-install-from-share-sheet-1.png" width='300px'/>
<img alt="" src="{{imgs_dir}}/ios-install-from-share-sheet-2.png" width='300px'/>

---

# Questions?

---

# Making it look like a native app

We can either,
1. Use CSS to make the app look like a native Android/iOS/Windows/etc. app.
2. Use a library that does some of this for us.

???

For now, we're going to select option 2.

---

# Making it look like a native app

[Google's Material Design website](https://m2.material.io) suggests using [material-components-web](https://github.com/material-components/material-components-web/blob/master/docs/getting-started.md#quick-start-cdn). Let's do that:
**index.html**:
```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/material-components-web@14.0.0/dist/material-components-web.min.css" integrity="sha256-YPguGDqg55HB8+tbrJBbWuiF9J+XCK7sjscaiwFMTxI=" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/material-components-web@14.0.0/dist/material-components-web.min.js" integrity="sha256-8DHMt+TYs1kVcO+R+oZYTrHYIYwHUOChiQsqKb2BT3g=" crossorigin="anonymous"></script>

        <title>Counter</title>
        ...
    </head>
    <body>
        <div>
            <span id='counter'></span>
            <button id='add-to-counter'>+</button>
        </div>
    </body>
    ...
</html>
```

???

Getting the package's subresource integrity check: [Visit the library's page on JSDelivr](https://www.jsdelivr.com/package/npm/material-components-web), then use the "show and configure all links button".


---

# Make the button a floating action button

```html
<!DOCTYPE html>
<html>
    <head>
        ...

        <title>Counter</title>
        ...
    </head>
    <body>
        <div>
            <span id='counter'></span>
        </div>

        <div class='mdc-touch-target-wrapper'>
            <button
                id='add-to-counter'
                class='mdc-fab mdc-fab--mini mdc-fab--touch'
            >
                <div class='mdc-fab__ripple'></div>
                <span class='mdc-fab__icon'>+</span>
                <div class='mdc-fab__touch'></div>
            </button>
        </div>
    </body>
    ...
</html>
```

**in counter.js**:
```js
...

mdc.ripple.MDCRipple.attachTo(incrementButton);
```

???

Ref https://m2.material.io/components/buttons-floating-action-button/web#regular-fabs

There's an issue with the button still:
![button isn't near the bottom right corner of the screen]({{imgs_dir}}/add-button-in-wrong-place.png)

---

# Live coding: Fixing the button


---

# From here:

## Mobile-like sidebar, pushbuttons, etc.
- [Material UI --- Library to make things look like a mobile app](https://m2.material.io/components/app-bars-top/web#using-the-top-app-bar)

## Notifications
- [Triggering a notification with the push API](https://web.dev/notifications/)

## Accelerometer
- [Sensing: Accelerometer](https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer), [Sensing: Accelerometer: iOS/Safari](https://kongmunist.medium.com/accessing-the-iphone-accelerometer-with-javascript-in-ios-14-and-13-e146d18bb175), [Getting accelerometer permissions in Safari/iOS](https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2)

???

To-do: [Notifications](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Re-engageable_Notifications_Push)

</div>
