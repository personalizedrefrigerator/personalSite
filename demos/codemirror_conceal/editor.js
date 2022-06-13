// Ref: https://codemirror.net/examples/bundle/
// and  https://codemirror.net/examples/decoration/
// This is heavily based on the later.
import {EditorView, basicSetup} from "codemirror";
import {Decoration, WidgetType} from "@codemirror/view";
import {ViewPlugin, ViewUpdate} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";
import {StateField, StateEffect} from "@codemirror/state";
import {markdown} from "@codemirror/lang-markdown";
import {GFM} from "@lezer/markdown";

// In TypeScript, we also need to import DecorationSet
//
const CHECKBOX_CLASS_NS = "cm-checkbox-toggle";

class CheckboxWidget extends WidgetType {
    constructor(checked) {
        super();
        this.checked = checked;
    }

    eq(other) {
        return other.checked == this.checked;
    };

    toDOM() {
        let container = document.createElement("span");
        // Checking/unchecking will require a pointing device...
        // Do we want to fix this?
        container.setAttribute("aria-hidden", true);
        container.classList.add(CHECKBOX_CLASS_NS);

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.checked;
        container.appendChild(checkbox);

        return container;
    };

    ignoreEvent() {
        return false;
    };
};

function checkboxes(view) {
    let widgets = [];
    for (let {from, to} of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from, to,
            enter: node => {
                if (node.name == "TaskMarker") {
                    let content = view.state.doc.sliceString(node.from, node.to);
                    let isChecked = content.toLowerCase().indexOf("x") != -1;
                    let decoration = Decoration.widget({
                        widget: new CheckboxWidget(isChecked),
                        side: 0,
                    });
                    widgets.push(decoration.range(node.to - 1));
                }

            },
        });
    }
    return Decoration.set(widgets);
}

const checkboxPlugin = ViewPlugin.fromClass(class {
    decorations;

    constructor(view) {
        this.decorations = checkboxes(view);
    };

    update(update) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = checkboxes(update.view);
        }
    };
}, {
    decorations: view => view.decorations,

    eventHandlers: {
        mousedown: (evt, view) => {
            let target = evt.target;
            if (target.nodeName == "INPUT" &&
                target.parentElement.classList.contains(CHECKBOX_CLASS_NS)) {
                return toggleCheckbox(view, view.posAtDOM(target) + 1);
            }
        },
    },
});

function toggleCheckbox(view, pos) {
    let before = view.state.doc.sliceString(Math.max(0, pos - 3), pos);
    let change;

    if (before.toLowerCase() == "[x]") {
        change = { from: pos - 3, to: pos, insert: "[ ]" };
    }
    else {
        change = { from: pos - 3, to: pos, insert: "[x]" };
    }

    view.dispatch({ changes: change });
    return true;
}

let editor = new EditorView({
    extensions: [
        basicSetup,
        markdown({
            extensions: [GFM],
        }),
        checkboxPlugin,
    ],
    doc: `# Testing
- [x] Hello
- [ ] World
- [ ] This is a checklist item.
    `,
    parent: document.body,
});
