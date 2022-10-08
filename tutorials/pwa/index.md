---
layout: remark_slideshow
title:  "Progressive Web App Tutorial"
description: Work-in-progress tutorial on the basics of progressive web apps (and HTML).
katex: true
---

{% assign imgs_dir = "./imgs" %}

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

# Agenda
 * Learn what a PWA is.
 * *Quick* introduction to HTML/CSS.
 * What does it take to make a web app installable?
 * iOS-specific configuration.
 * Showing a notification.

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

.center[![](./imgs/html.svg)]

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

---
{% capture css_header %}<span style="font-family: 'Tex Gyre Bonum', serif; font-weight: bold;">C</span><span style="font-family: 'Tex Gyre Adventor', sans; transform: scale(0.9, 1) rotate(6deg); display: inline-block;">S</span>S{%endcapture%}
# {{css_header}}

 * Changes how things on a website look.
 * Decides what to style based on *tags*.

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

</div>
