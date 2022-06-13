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

function checkboxes(view, conceal) {
    let widgets = [];
    for (let {from, to} of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from, to,
            enter: node => {
                if (node.name == "TaskMarker") {
                    let content = view.state.doc.sliceString(node.from, node.to);
                    let isChecked = content.toLowerCase().indexOf("x") != -1;
                    if (conceal) {
                        let decoration = Decoration.replace({
                            widget: new CheckboxWidget(isChecked),
                        });
                        widgets.push(decoration.range(node.to - 2, node.to - 1));
                    } else {
                        let decoration = Decoration.widget({
                            widget: new CheckboxWidget(isChecked),
                            side: 0,
                        });
                        widgets.push(decoration.range(node.to - 1));
                    }
                }

            },
        });
    }
    return Decoration.set(widgets);
}

const checkboxPlugin = conceal => ViewPlugin.fromClass(class {
    decorations;

    constructor(view) {
        this.decorations = checkboxes(view, conceal);
    };

    update(update) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = checkboxes(update.view, conceal);
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

function createEditor(container, conceal) {
    return new EditorView({
        extensions: [
            basicSetup,
            markdown({
                extensions: [GFM],
            }),
            checkboxPlugin(conceal),
        ],
        doc: `# Testing
- [x] Hello
- [ ] World
- [ ] This is a checklist item.
        `,
        parent: container,
    });
}

createEditor(document.querySelector("#editorUnconcealed"), false);
createEditor(document.querySelector("#editorConcealed"), true);

