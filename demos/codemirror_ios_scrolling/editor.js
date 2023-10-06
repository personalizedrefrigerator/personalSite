import {EditorView, basicSetup} from "codemirror";

const hugeDocLines = [
    'This is a very long document. Try dragging the vertical scrollbar on iOS.'
];

for (let i = 0; i < 10_000; i++) {
    hugeDocLines.push(`Line ${i}.`);
}

new EditorView({
    doc: hugeDocLines.join('\n'),
    extensions: [
        basicSetup,
        EditorView.theme({
            '& .cm-scroller': {
                height: '80vh',
            },
        }),
    ],
    parent: document.body,
});
