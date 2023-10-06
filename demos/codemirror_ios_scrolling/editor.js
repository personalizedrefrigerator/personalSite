import {EditorView, basicSetup} from "codemirror";

const hugeDocLines = [
    'This is a very long document. Try dragging the vertical scrollbar on iOS.'
];

for (let i = 0; i < 10_000; i++) {
    hugeDocLines.push(
        `Line ${i}. It seems that lines may need to be long enough to wrap to trigger the bug. ` + 
        `As such, each line is long. Long enough to cause the line to wrap. ` +
        `It seems that this might not be an issue on just iOS -- Firefox on Linux also seems to ` +
        `have trouble when dragging the scroll bar.`);
}

const lineWrap = !location.href.endsWith('?no-wrap');

new EditorView({
    doc: hugeDocLines.join('\n'),
    extensions: [
        basicSetup,

        lineWrap ? EditorView.lineWrapping : [],
        EditorView.theme({
            '& .cm-scroller': {
                height: '60vh',
                'overflow-y': 'auto',
            },
        }),
    ],
    parent: document.body,
});
