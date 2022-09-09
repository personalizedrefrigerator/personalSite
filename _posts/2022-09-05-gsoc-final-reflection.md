---
layout: post
title:  "Final Reflection — Google Summer of Code"
katex: true
tags: gsoc joplin
---

{% assign assets_dir = '/assets/img/posts/2022-09-05-gsoc-final-reflection/' %}

<!-- Relevant links -->
[Weekly status updates][weekly-status-updates] | [GSoC project page][gsoc-project-page] | [GSoC pull requests][gsoc-pull-requests]

# Goals
 - [x] Create a markdown toolbar
 - [x] Create a freehand drawing widget
 - [ ] Add the freehand drawing widget to the mobile app
 - [x] Add the freehand drawing widget to the desktop app
   - This was done via a [plugin][js-draw-plugin].

# The image editor/freehand drawing widget
[js-draw on NPM][js-draw-npm] | [Joplin Plugin][js-draw-plugin]

While creating my GSoC proposal, I decided to spend my summer working on two sub-projects: building a markdown toolbar for Joplin's mobile app and creating an image editor for both the mobile and desktop apps.

While `js-draw` hasn't yet been added to the mobile app, I've [added it to the desktop app through a plugin][js-draw-plugin].

<aside markdown=1>
<h2>Why hasn't <code>js-draw</code> been added to the mobile app?</h2>

I'm waiting for it to reach a more stable state — updating `js-draw` within the mobile app is much more difficult than updating a plugin for the desktop app.

Before making `js-draw` its own project, I created [a pull request adding the image editor to the mobile app](https://github.com/laurent22/joplin/pull/6739). I expect the next pull request that provides `js-draw` integration to be similar.

</aside>

Try `js-draw` below!
<script src="https://cdn.jsdelivr.net/npm/js-draw@0.1.10/dist/bundle.js" integrity="sha256-es3CO1AseW9wAb9mNDfjEhUWKNZncCRoYMTdpw2t2VI=" crossorigin="anonymous"></script>
<style>
body {
    --background-color-copy: var(--primary-background-color);
}
.imageEditorContainer {
    --primary-background-color: var(--background-color-copy);
    --primary-background-color-transparent: var(--primary-background-color);
    --secondary-background-color: var(--selected-item-bg-color);
    --primary-foreground-color: var(--primary-text-color);
    --secondary-foreground-color: var(--selected-item-fg-color);
    --primary-shadow-color: var(--shadow-color-light);
}
</style>
<script>
    // Adds a save action to a js-draw editor's toolbar.
    function addSaveAction(editor, toolbar) {
        toolbar.addActionButton('Save', function() {
            const img = editor.toSVG();
            const blob = new Blob([ img.outerHTML ],  { type: 'image/svg+xml' });
            const objectURL = URL.createObjectURL(blob);
            ;
            const link = document.createElement('a');
            link.href = objectURL;
            link.innerText = 'Save';
            link.setAttribute('download', 'image.svg');
            ;
            document.body.appendChild(link);
            ;
            link.click();
            ;
            link.remove();
            URL.revokeObjectURL(objectURL);
        });
    }
;
    function initEditor(outputElemSelector, svgData) {
        const container = document.querySelector(outputElemSelector);
        const editor = new jsdraw.Editor(container, {
            wheelEventsEnabled: 'only-if-focused',
        });
        ;
        const toolbar = editor.addToolbar();
        addSaveAction(editor, toolbar);
        ;
        editor.getRootElement().style.height = '500px';
        editor.loadFromSVG(svgData);
        editor.viewport.resetTransform();
    }
</script>
<div id='jsDrawDemo-1'></div>
<script>
    initEditor('#jsDrawDemo-1', `<svg viewBox="0 0 496.5 320.32" width="496.5" height="320.32" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg"><text style="transform: matrix(1, 0, 0, 1, 29, 43); font-family: sans-serif; font-size: 32px; fill: rgb(128, 51, 128);">JS-Draw Demo!</text><path d="M319.9,7.9Q311.4,20 311.1,27.6L312.7,27.6Q312.8,20.6 321.1,8.9M311.1,27.6Q310.6,51.2 321.3,51.9L321.3,50.3Q311.9,50.3 312.7,27.6M321.3,51.9Q321.9,51.9 324.2,52.6L324.6,51Q322.2,50.4 321.3,50.3" fill="#803380"></path><path d="M332,20.5Q341.1,17.7 350.6,12.6L349.8,11.2Q340.5,16.3 331.6,19.1M350.6,12.6Q351.1,12.2 351.1,12.3L351.7,10.9Q350.9,10.7 349.8,11.2M351.1,12.3Q351.5,12.1 350.3,15.2L351.7,15.8Q353.1,11.8 351.7,10.9M350.3,15.2Q349.5,17.5 352.1,34.7L353.7,34.5Q351,17.5 351.7,15.8M352.1,34.7Q353.9,45.2 345.1,50.4L345.9,51.8Q355.3,45.8 353.7,34.5M345.1,50.4Q341.3,53.1 338.4,47.1L337,47.9Q340.8,54.6 345.9,51.8M338.4,47.1Q336.7,44.3 339.5,41.4L338.3,40.4Q335.2,44 337,47.9" fill="#803380"></path><path d="M373.8,19.2Q369.9,16.3 364.7,16.2L364.7,17.8Q369.4,17.7 372.8,20.4M364.7,16.2Q356.8,16.6 359.7,23.2L361.1,22.6Q358.2,17.4 364.7,17.8M359.7,23.2Q361.3,26.4 368.9,33.3L369.9,32.1Q362.5,25.4 361.1,22.6M368.9,33.3Q373.1,36.9 371,41.4L372.4,42Q374.6,36.5 369.9,32.1M371,41.4Q370.4,43.4 360.9,41.7L360.7,43.3Q370.9,44.9 372.4,42M360.9,41.7Q358.4,41.6 359.9,37.6L358.5,37.2Q357,42.3 360.7,43.3" fill="#803380"></path><path d="M378.9,30.3Q388.5,29.6 394.4,29.6L394.4,28Q388.5,28 378.7,28.7" fill="#803380"></path><path d="M399.1,13.2Q401.8,33.3 401.8,45.6L403.4,45.6Q403.4,33.2 400.7,13M401.8,45.6Q402.4,47.3 406.3,44.2L405.3,43Q402.8,45.8 403.4,45.6M406.3,44.2Q408.1,42.5 416.4,41.7L416.2,40.1Q407.5,41 405.3,43M416.4,41.7Q425.5,40.5 423.8,31.7L422.2,32.1Q424.2,39.6 416.2,40.1M423.8,31.7Q421.4,22 410.1,15.9L409.3,17.3Q420.2,23 422.2,32.1M410.1,15.9Q406.4,14.1 399.3,15.8L399.7,17.4Q406.3,15.6 409.3,17.3" fill="#803380"></path><path d="M425.3,23.7Q429.9,23.6 430.5,24.9L431.9,24.1Q430.5,22.2 425.3,22.1M430.5,24.9Q432.2,27.5 430,38L431.6,38.4Q433.7,27.4 431.9,24.1M430,38.2Q430,38.2 430,42.8L431.6,42.8Q431.6,38.2 431.6,38.2" fill="#803380"></path><path d="M431.5,25.6Q435.4,19.5 437.4,18.9L436.8,17.5Q434.3,18.4 430.1,24.8M437.4,18.9Q443.6,16.5 443.3,22.5L444.9,22.5Q444.5,15.2 436.8,17.5" fill="#803380"></path><path d="M450.3,23.9Q452.8,15.7 456.2,15.9L456.2,14.3Q451.7,14.6 448.9,23.5M456.2,15.9Q459.9,15.5 459.7,21.7L461.3,21.7Q461.1,14.5 456.2,14.3M459.7,21.7Q459.7,27 457.4,43.1L459,43.3Q461.3,27.2 461.3,21.7M457.4,43.1Q457.4,45.3 459.4,45.6L459.4,44Q458.6,44.3 459,43.3" fill="#803380"></path><path d="M461,35.6Q453.6,29.1 449.8,32.6L451,33.6Q453.4,30.7 460,36.8M449.8,32.6Q445.1,37.7 448.9,45.5L450.3,44.9Q446.7,37.8 451,33.6M448.9,45.5Q450.8,48.6 457.8,45.1L457,43.7Q451,47 450.3,44.9M457.8,45.1Q458.2,44.8 458.8,44.1L457.6,43.1Q457.1,43.7 457,43.7" fill="#803380"></path><path d="M464.2,32.6Q467.7,30.4 468.8,31.7L469.8,30.5Q467.7,28.8 463.4,31.2M468.8,31.7Q472.9,35.2 469.7,41.8L471.1,42.4Q474.4,35 469.8,30.5M469.7,41.8Q468.3,45.2 472.7,48.9L473.7,47.7Q469.8,44.7 471.1,42.4M472.7,48.9Q475.7,51 479.6,46.9L478.4,45.9Q475.4,49.4 473.7,47.7M479.6,46.9Q482.9,43.1 483,38.5L481.4,38.5Q481.5,42.6 478.4,45.9M483,38.5Q482.4,32.5 485.5,37.8L486.7,37Q482,31 481.4,38.5M485.5,37.8Q486.7,39.5 484.9,47L486.5,47.4Q488.3,39.4 486.7,37M484.9,47Q485.1,49.4 491.6,45.5L490.8,44.1Q485.7,47.9 486.5,47.4M491.5,45.5Q493.1,44.6 493.1,28.8L491.5,28.8Q491.5,44.1 490.9,44.1M493.1,28.8Q492.7,29.1 493.6,29.2L493.4,27.6Q491.9,27.8 491.5,28.8" fill="#803380"></path><path d="M490.8,15.3Q495,29.3 493.9,37.3L495.5,37.5Q496.5,29.1 492.4,14.9M493.9,37.3Q493.5,41.2 486.6,51.8L488,52.6Q494.9,41.8 495.5,37.5" fill="#803380"></path><text style="transform: matrix(0.332139, 0, 0, 0.332139, 31.3, 78.7); font-family: serif; font-size: 32px; fill: rgb(153, 125, 61);">⚠ To load saved images, please use the live demo linked in js-draw's README (see</text><text style="transform: matrix(0.332139, 0, 0, 0.332139, 46.3, 91.6); font-family: serif; font-size: 32px; fill: rgb(153, 125, 61);">its NPM landing page. ⚠</text><text style="transform: matrix(0.631849, 0, 0, 0.631849, 33.6, 130); font-family: serif; font-size: 32px; fill: rgb(92, 153, 61);">JS-Draw supports</text><text style="transform: matrix(0.631849, 0, 0, 0.631849, 56.3, 154); font-family: serif; font-size: 32px; fill: rgb(92, 153, 61);">• Zoom levels from less than 1·10⁻⁶ to</text><text style="transform: matrix(0.631849, 0, 0, 0.631849, 77.1, 181.1); font-family: serif; font-size: 32px; fill: rgb(92, 153, 61);">greater than 1·10⁶x.</text><text style="transform: matrix(2.55765e-7, 0, 0, 2.55765e-7, 250.457, 180.305); font-family: serif; font-size: 32px; fill: rgb(92, 153, 61);">This is an example of text drawn at</text><text style="transform: matrix(7.95172e-8, 0, 0, 7.95172e-8, 250.457, 180.305); font-family: serif; font-size: 32px; fill: rgb(92, 153, 61);">12,575,895x zoom.</text><path d="M265.62,176.07L265.62,164.26L255.99,164.26L255.99,176.07" fill="#ffffff"></path><text style="transform: matrix(0.402898, 0, 0, 0.336828, 256.941, 172.58); font-family: monospace; font-size: 32px; fill: rgb(92, 153, 61);">7</text><path d="M259.6,168.4Q260.5,168.4 263.4,168.1L263.4,168Q260.5,168.2 259.6,168.3" fill="#42cc33"></path><text style="transform: matrix(0.415397, 0, 0, 0.415397, 58.3, 210.9); font-family: monospace; font-size: 32px; fill: rgb(92, 153, 61);">• Loading and saving to SVGs.</text><text style="transform: matrix(0.415397, 0, 0, 0.415397, 58.7, 230.8); font-family: monospace; font-size: 32px; fill: rgb(92, 153, 61);">• Large images</text><text style="transform: matrix(0.16757, 0, 0, 0.16757, 80.3, 238.3); font-family: monospace; font-size: 32px; fill: rgb(92, 153, 61);">— When a large number of strokes are visible, the display is divided up into grids and sub-grids</text><text style="transform: matrix(0.16757, 0, 0, 0.16757, 87.1, 244.5); font-family: monospace; font-size: 32px; fill: rgb(92, 153, 61);">where each grid unit caches a rendered segment of the image.</text><text style="transform: matrix(0.0123646, 0.00713148, -0.00713872, 0.0123521, 283.63, 239.818); font-family: monospace; font-size: 32px; fill: rgb(92, 153, 61);">For some reason</text><text style="transform: matrix(0.0123646, 0.00713148, -0.00713872, 0.0123521, 287.264, 241.833); font-family: monospace; font-size: 32px; fill: rgba(92, 152, 60, 0.75);">, Safari and Firefox are able</text><text style="transform: matrix(0.0123646, 0.00713148, -0.00713872, 0.0123521, 283.433, 240.264); font-family: monospace; font-size: 32px; fill: rgba(92, 152, 60, 0.75);">to render images made with js-draw than Chrome and</text><text style="transform: matrix(0.0123646, 0.00713148, -0.00713872, 0.0123521, 283.192, 240.652); font-family: monospace; font-size: 32px; fill: rgba(92, 152, 60, 0.75);">Chrome-based browsers...</text><text style="transform: matrix(0.175012, 0, 0, 0.175012, 288, 167); font-family: monospace; font-size: 32px; fill: rgba(92, 152, 60, 0.75);">- Touchscreen, ctrl+scroll, and pinch zooming</text><text style="transform: matrix(0.175012, 0, 0, 0.175012, 402.1, 171.3); font-family: monospace; font-size: 32px; fill: rgba(92, 152, 60, 0.75);">↑</text><text style="transform: matrix(0.0695256, 0, 0, 0.0695256, 383.4, 174.1); font-family: monospace; font-size: 32px; fill: rgba(92, 152, 60, 0.75);">Pinch zooming may not work in Google Chrome.</text><text style="transform: matrix(0.0708614, 0, 0, 0.0708614, 393.2, 176.59); font-family: monospace; font-size: 32px; fill: rgba(92, 152, 60, 0.75);">It works in Firefox, though!</text><text style="transform: matrix(0.207017, 0, 0, 0.207017, 60.1, 256.9); font-family: monospace; font-size: 32px; fill: rgba(90, 151, 59, 0.957);">• Undo/redo</text><text style="transform: matrix(0.422008, 0, 0, 0.422008, 61.5, 267.8); font-family: monospace; font-size: 32px; fill: rgba(90, 151, 59, 0.957);">• Rotating the viewport</text><text style="transform: matrix(0.0258574, 0.00809798, -0.00692848, 0.0302221, 247.362, 260.159); font-family: monospace; font-size: 32px; fill: rgba(90, 151, 59, 0.957);">(with a touchscreen or by pressing R or r on a keyboard.)</text><text style="transform: matrix(0.149962, 0, 0, 0.149962, 62.7, 275.5); font-family: monospace; font-size: 32px; fill: rgba(90, 151, 59, 0.957);">• Vim-like h,j,k,l keyboard navigation.</text><text style="transform: matrix(0.034576, 0, 0, 0.034576, 63.26, 278.06); font-family: monospace; font-size: 32px; fill: rgba(90, 151, 59, 0.957);">• Accessibility announcements when undoing/redoing/adding strokes and text.</text><text style="transform: matrix(0.213993, 0, 0, 0.213993, 61.7, 286.5); font-family: monospace; font-size: 32px; fill: rgba(90, 151, 59, 0.957);">• Bézier curve fitting</text><text style="transform: matrix(0.0493392, 0, 0, 0.0493392, 72.5, 288.9); font-family: monospace; font-size: 32px; fill: rgba(90, 151, 59, 0.957);">— Curve fitting is done with the help of bezier-js</text><text style="transform: matrix(0.00734983, 0, 0, 0.00734983, 111.668, 289.357); font-family: monospace; font-size: 32px; fill: rgba(59, 146, 151, 0.957);">https://www.npmjs.com/package/bezier-js</text><text style="transform: matrix(0.0378354, 0, 0, 0.0378354, 63, 294); font-family: monospace; font-size: 32px; fill: rgba(59, 151, 71, 0.957);">• Pen pressure sensitivity</text><text style="transform: matrix(0.0587694, 0, 0, 0.0587694, 63.12, 290.85); font-family: monospace; font-size: 32px; fill: rgba(59, 151, 71, 0.957);">• Rotating/scaling strokes</text><text style="transform: matrix(0.036969, 0, 0, 0.036969, 63.27, 296.44); font-family: monospace; font-size: 32px; fill: rgba(59, 151, 71, 0.957);">• Changing pen colors</text><text style="transform: matrix(0.0173823, 0, 0, 0.0173823, 78.95, 295.77); font-family: monospace; font-size: 32px; fill: rgba(59, 151, 71, 0.957);">With the help of the Coloris color picker library!</text><text style="transform: matrix(0.00282858, 0, 0, 0.00282858, 87.13, 295.915); font-family: monospace; font-size: 32px; fill: rgba(78, 151, 59, 0.957);">on NPM</text><text style="transform: matrix(0.00282858, 0, 0, 0.00282858, 86.091, 295.928); font-family: monospace; font-size: 32px; fill: rgba(151, 117, 59, 0.957);">@melloware/coloris</text><text style="transform: matrix(0.0013122, 0, 0, 0.0013122, 86.105, 296.023); font-family: monospace; font-size: 32px; fill: rgba(59, 149, 151, 0.957);">https://www.npmjs.com/package/@melloware/coloris</text><text style="transform: matrix(0.124112, 0, 0, 0.124112, 62.9, 299.9); font-family: monospace; font-size: 32px; fill: rgba(61, 151, 59, 0.957);">• Loading/saving from/to SVG</text><text style="transform: matrix(0.0160498, 0, 0, 0.0160498, 69.98, 300.37); font-family: monospace; font-size: 32px; fill: rgba(61, 151, 59, 0.957);">↑</text><text style="transform: matrix(0.00375766, 0, 0, 0.00375766, 69.544, 300.573); font-family: monospace; font-size: 32px; fill: rgba(138, 151, 59, 0.957);">Only supports a very limited subset of SVG, even if it does try to preserve unrecognized SVG elements.</text><text style="transform: matrix(0.0438965, 0, 0, 0.0438965, 294.8, 170.6); font-family: monospace; font-size: 32px; fill: rgba(138, 151, 59, 0.957);">(You can also zoom by pressing the w and s keys!</text><text style="transform: matrix(0.0309699, 0, 0, 0.0408575, 335.28, 170.564); font-family: monospace; font-size: 32px; fill: rgba(138, 151, 59, 0.957);">)</text><path d="M324.06031778599373,170.9296822140063L324.19968221400626,170.79031778599372L325.40031778599376,170.79031778599372L325.40031778599376,169.5996822140063L324.19968221400626,169.5996822140063L324.19968221400626,170.79031778599372L324.06031778599373,170.9296822140063L324.06031778599373,169.4603177859937L325.5396822140063,169.4603177859937L325.5396822140063,170.9296822140063" fill="#aba93a"></path><path d="M329.27031778599377,170.8996822140063L329.4096822140063,170.76031778599372L330.3803177859937,170.76031778599372L330.3803177859937,169.5696822140063L329.4096822140063,169.5696822140063L329.4096822140063,170.76031778599372L329.27031778599377,170.8996822140063L329.27031778599377,169.4303177859937L330.51968221400625,169.4303177859937L330.51968221400625,170.8996822140063" fill="#aba93a"></path><path d="M93.81890784172289,276.2010921582771L94.0010921582771,276.0189078417229L97.6689078417229,276.0189078417229L97.6689078417229,271.1710921582771L94.0010921582771,271.1710921582771L94.0010921582771,276.0189078417229L93.81890784172289,276.2010921582771L93.81890784172289,270.9889078417229L97.85109215827711,270.9889078417229L97.85109215827711,276.2010921582771" fill="#aba93a"></path><path d="M99.5289078417229,276.8410921582771L99.71109215827711,276.6589078417229L102.8889078417229,276.6589078417229L102.8889078417229,271.5010921582771L99.71109215827711,271.5010921582771L99.71109215827711,276.6589078417229L99.5289078417229,276.8410921582771L99.5289078417229,271.31890784172293L103.07109215827711,271.31890784172293L103.07109215827711,276.8410921582771" fill="#aba93a"></path><path d="M105.6389078417229,275.9910921582771L105.82109215827711,275.80890784172294L109.1189078417229,275.80890784172294L109.1189078417229,271.1710921582771L105.82109215827711,271.1710921582771L105.82109215827711,275.80890784172294L105.6389078417229,275.9910921582771L105.6389078417229,270.9889078417229L109.30109215827711,270.9889078417229L109.30109215827711,275.9910921582771" fill="#aba93a"></path><path d="M111.3889078417229,276.0710921582771L111.57109215827711,275.8889078417229L114.62890784172289,275.8889078417229L114.62890784172289,271.3010921582771L111.57109215827711,271.3010921582771L111.57109215827711,275.8889078417229L111.3889078417229,276.0710921582771L111.3889078417229,271.1189078417229L114.8110921582771,271.1189078417229L114.8110921582771,276.0710921582771" fill="#aba93a"></path><text style="transform: matrix(0.124325, 0, 0, 0.124325, 42.8, 315.5); font-family: serif; font-size: 32px; fill: rgba(138, 151, 59, 0.957);">Does NOT yet support (among other things)</text><text style="transform: matrix(0.0735582, 0, 0, 0.0735582, 49.4, 318.9); font-family: serif; font-size: 32px; fill: rgba(138, 151, 59, 0.957);">• Editing existing text</text><text style="transform: matrix(0.0735582, 0, 0, 0.0735582, 49.55, 320.32); font-family: serif; font-size: 32px; fill: rgba(138, 151, 59, 0.957);">• Realtime collaboration</text></svg>`);
</script>

## Features
 * Zoom levels from $$\leq 1\cdot 10^{-6}$$ to $$\geq 1\cdot 10^6$$ times.
 * Keyboard shortcuts:
    * `h`, `j`, `k`, `l`, `a`, `d`, and arrow keys move the view.
    * `w` and `s` zoom the view in/out.
    * `ctrl+z`, `ctrl+Shift+Z`: undo and redo.
 * Bézier curve fitting:
    * Strokes are converted into Bézier curves
      * <div id='jsDrawDemo-2'></div>
    * This uses [bezier-js](https://www.npmjs.com/package/bezier-js) for projecting points onto Bézier curves, finding normals, and Bézier curve intersection testing.

<script>
    initEditor('#jsDrawDemo-2', `<svg viewBox="0 0 785.7807895409187 481" width="785.7807895409187" height="481" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg"><path d="M503.7233362768156,1.5509355509355514Q499.3573794168714,174.48024948024954 477.52759511715294,208.60083160083144L527.0084395298481,242.7214137214136Q557.5701375494547,187.66320166320165 561.9360944093976,3.1018711018711027M477.52759511715294,208.60083160083144Q431.6850480877436,310.18711018711025 337.8169755989536,193.86694386694398L295.6127259528313,237.29313929313915Q435.3233454710302,373 527.0084395298481,242.7214137214136M337.8169755989536,193.86694386694398Q323.9914455424654,178.35758835758827 284.69783380297156,121.74844074844077L236.67230834359071,158.97089397089388Q278.14889851305605,218.68191268191262 295.6127259528313,237.29313929313915M284.69783380297156,121.74844074844077Q262.86804950325296,95.38253638253634 183.55316654760858,70.56756756756748L167.54465806114834,131.0540540540541Q234.4893299136189,150.4407484407484 236.67230834359071,158.97089397089388M183.55316654760858,70.56756756756748Q117.33615417179541,61.26195426195427 58.39573656255488,177.5821205821205L110.78721888187972,205.49896049896057Q148.62551166805878,114.76923076923077 167.54465806114834,131.0540540540541M58.39573656255488,177.5821205821205Q32.19999540289255,233.41580041580053 14.008508486460345,255.90436590436587L59.12339603921214,296.22869022868997Q81.68083981558823,267.53638253638235 110.78721888187972,205.49896049896057M14.008508486460345,255.90436590436587Q4.548935289915597,268.3118503118503 -2,288.4740124740122L53.302120225953914,308.6361746361743Q56.212758132583026,298.55509355509366 59.12339603921214,296.22869022868997" fill="#803380"></path><path d="M184.28082602426576,71.34303534303531Q179.18720968766493,95.38253638253634 168.27231753780546,135.7068607068606L169.72763649112,135.7068607068606Q180.64252864097926,96.15800415800418 185.73614497758044,71.34303534303531" fill="#cc6633"></path><path d="M59.12339603921214,179.90852390852385Q103.51062411530681,207.82536382536398 109.33189992856511,208.60083160083144L109.33189992856511,207.04989604989595Q104.23828359196413,206.27442827442835 60.578714992526756,178.35758835758827" fill="#cc6633"></path><path d="M15.463827439774917,259.78170478170455Q22.740422206347805,266.76091476091494 43.84254702940917,288.4740124740122L45.29786598272377,286.923076923077Q24.195741159662436,265.2099792099793 16.919146393089502,258.2307692307693M43.84254702940917,288.4740124740122Q46.02552545938103,290.8004158004156 53.302120225953914,296.22869022868997L54.75743917926842,294.6777546777547Q47.480844412695575,289.2494802494802 45.29786598272377,286.923076923077M53.302120225953914,296.22869022868997Q54.02977970261122,296.22869022868997 55.48509865592579,299.3305613305618L56.94041760924031,297.7796257796258Q55.48509865592579,295.4532224532226 54.75743917926842,294.6777546777547" fill="#cc6633"></path><path d="M237.39996782024804,159.7463617463617Q249.7701789234219,151.216216216216 286.8808122329435,127.17671517671518L285.42549327962894,125.62577962577971Q248.31485997010728,150.4407484407484 235.94464886693314,158.19542619542628M286.8808122329435,127.17671517671518Q286.8808122329435,126.40124740124725 288.3361311862582,125.62577962577971L286.8808122329435,124.0748440748441Q286.1531527562863,125.62577962577971 285.42549327962894,125.62577962577971" fill="#cc6633"></path><path d="M297.06804490614536,238.0686070686072Q324.7191050191226,196.96881496881517 333.45101873901007,191.54054054054038L331.99569978569536,189.98960498960489Q323.9914455424654,195.41787941787956 295.6127259528313,236.51767151767166" fill="#cc6633"></path><path d="M478.9829140704677,208.60083160083144Q520.459504239933,227.2120582120584 523.3701421465619,233.41580041580053L524.825461099876,233.41580041580053Q521.1871637165902,225.66112266112287 478.9829140704677,207.04989604989595M523.3701421465619,233.41580041580053Q524.825461099876,236.51767151767166 529.9190774364785,243.49688149688154L531.3743963897922,241.945945945946Q526.2807800531918,235.74220374220374 524.825461099876,233.41580041580053" fill="#cc6633"></path><path d="M505.17865523012983,1.5509355509355514Q538.6509911563651,6.203742203742205 561.9360944093976,6.203742203742205L561.9360944093976,4.652806652806653Q538.6509911563651,4.652806652806653 505.17865523012983,0" fill="#cc6633"></path><path d="M-0.5446810466854229,290.8004158004156Q13.280849009803054,294.6777546777547 55.48509865592579,309.4116424116426L55.48509865592579,307.860706860707Q14.008508486460345,293.90228690228656 -0.5446810466854229,289.2494802494802" fill="#cc6633"></path><text style="transform: matrix(0.646015, 0, 0, 0.68846, 68.9468, 318.562); font-family: sans-serif; font-size: 32px; fill: rgb(128, 113, 51);">Each segment (marked in orange) is made up of</text><text style="transform: matrix(0.646015, 0, 0, 0.68846, 69.6017, 338.026); font-family: sans-serif; font-size: 32px; fill: rgb(128, 113, 51);">two lines and two Bézier curves.</text><text style="transform: matrix(0.646015, 0, 0, 0.68846, 71.5664, 361.368); font-family: sans-serif; font-size: 32px; fill: rgb(128, 113, 51);">Fitting is approximate — the curves created are not the best fit.</text></svg>`);
</script>

## What's done
 - [x] Tool that allows adding text to an image.
 - [x] Pen/drawing tool
 - [x] Saving/loading from a note in Joplin
 - [x] Add to the desktop app
    - Done as a [plugin][js-draw-plugin]
 - [ ] Add to the mobile app
 - [ ] Realtime collaborative editing
    - This wasn't originally planned, but I've started working on it — serialization to JSON for some of the important `Command` subclasses (e.g. `AddElementCommand`, `Erase`, ...) has been implemented. Serialization and deserialization will allow these commands to be sent over a network.



# The markdown toolbar
[UI pull request][markdown-toolbar-ui-pr] | [Markdown commands pull request][markdown-commands-pr]

![Screenshot of the markdown toolbar, showing buttons for bold, italicize, toggle code, show more, link, search, and hide keyboard]({{ assets_dir | append: 'markdown-toolbar-screenshot-1.png' | relative_url }})

The markdown toolbar is a feature added to Joplin's (beta) mobile editor. It allows quickly changing the formatting of a region.

## What's done
 - Find and replace tool
    - [x] Implemented and merged
 - Markdown commands
    - [x] Bold, italicize, toggle code region, toggle $$\TeX$$ region, toggle header
    - [x] Edit/insert link
 - Markdown toolbar
    - [x] Implemented and merged
 - CodeMirror GUI

## Bugs and what isn't done
 - [ ] On iOS, the keyboard for the markdown editor is always in light mode
    - As of the time of this writing, [`react-native-webview` doesn't support this](https://github.com/react-native-webview/react-native-webview/issues/1634). I tried adding support, but [didn't understand the suggested solution](https://stackoverflow.com/questions/28664984/custom-webview-keyboard-issues/47949089#47949089) (I'm new to Objective-C) and had trouble building/deploying `react-native-webview` to an iOS device.
    - [Joplin issue tracker](https://github.com/laurent22/joplin/issues/5775)

# Better markdown syntax highlighting

- [x] Added syntax highlighting for math ($$\KaTeX$$) regions in the CodeMirror 6 editor.
    - This involved writing a custom CodeMirror parser to recognize regions surrounded by `$`s and `$$`s.
- [x] Added syntax highlighting for fenced code regions
    - This *did not* require writing a custom parser.

![Screenshot of Joplin's beta editor. Math has highlighting, as do block quotes, bolded/italicized text]({{ assets_dir | append: 'better-syntax-highlighting.png' | relative_url }})


{% comment %}
### Bug #1: Keyboard overlaps toolbar on iOS

On iOS, React Native's `KeyboardAvoidingView` can sometimes compensate too much or too little for the keyboard. As such, the keyboard partially covered the toolbar on some devices.

Initially, I only tested the markdown toolbar on one iOS device (I _did_ test it on multiple Android devices). On that iOS device — the iPhone 13 simulator — React Native doesn't add enough space at the bottom of the `KeyboardAvoidingView`. I compensated for this by manually adding an additional `16px` of padding beneath the toolbar if `Platform.OS === 'ios'`.

After the markdown toolbar, and thus this workaround, was merged, I tested the app on a different iOS device and noticed the issue mentioned above. The fix for this other set of iOS devices was to add a button beneath the toolbar. If this button is visible, the user is on a device where space needs to be removed beneath the toolbar. Otherwise, the button is invisible.

I quite dislike this fix.
To-do:
# Other bugs I worked on, but didn't fix
 - Keyboard light in dark mode on iOS
# Other bugs I fixed
 - Android: Worked around a bug in CodeMirror and selecting text
{% endcomment %}

[markdown-commands-pr]: https://github.com/laurent22/joplin/pull/6707
[markdown-toolbar-ui-pr]: https://github.com/laurent22/joplin/pull/6753
[js-draw-npm]: https://www.npmjs.com/package/js-draw
[js-draw-plugin]: https://discourse.joplinapp.org/t/plugin-js-draw-integration/27114
[gsoc-project-page]: https://summerofcode.withgoogle.com/proposals/details/kkfqMKMK
[weekly-status-updates]: https://discourse.joplinapp.org/tags/c/gsoc-projects/mobile-editor-improvements/29/report
[gsoc-pull-requests]: https://github.com/laurent22/joplin/pulls?q=is%3Apr+author%3Apersonalizedrefrigerator++created%3A%3C2022-09-08