var jsonForm = new JsonForm();
var formJson = {
    hide_validation: false,
    button_orientation: "left",
    fields: [
        {
            id: "name",
            name: "What is your name?",
            type: "field",
            field: {
                type: "text",
                placeholder: "Name",
                default_value: "Bob Smith",
                helptext: "Any preferred name"
            }
        },
        {
            id: "color",
            name: "What is your favorite color?",
            type: "field",
            field: {
                type: "color",
                placeholder: "Color"
            }
        },
        {
            id: "canttouchthis",
            name: "You can't touch this",
            type: "field",
            field: {
                type: "text",
                readonly: true,
                placeholder: "I'm a placeholder",
                helptext: "You're not allowed to edit this field"
            }
        },
        {
            id: "notcheckedanddisabled",
            name: "Can't check me",
            type: "field",
            field: {
                type: "checkbox",
                readonly: true,
            }
        },
        {
            id: "checked",
            name: "Uncheck me",
            type: "field",
            field: {
                type: "checkbox",
                default_value: "true",
            }
        },
        {
            id: "abcradio",
            name: "A, B, or C?",
            type: "field",
            field: {
                type: "radio",
                // default_value: "Option B",
                options: ["Option A", "Option B", "Option C"],
                width: "6"
            }
        },
        {
            id: "inlineabcradio",
            name: "Inline A, B, or C?",
            type: "field",
            field: {
                type: "radio",
                default_value: "Option B",
                inline: true,
                options: ["Option A", "Option B", "Option C"],
                width: "6"
            }
        },
        {
            id: "switchon",
            name: "Switch that is on by default",
            type: "field",
            field: {
                type: "switch",
                default_value: "true",
            }
        },
        {
            id: "select",
            name: "Pick a direction",
            type: "field",
            field: {
                type: "select",
                default_value: "Top",
                options: ["Left", "Right", "Top", "Bottom"]
            }
        },
        {
            id: "file",
            name: "Upload a cat picture",
            type: "field",
            field: {
                type: "file"
            }
        },
    ]
}

function MyFormHandler(valid, data) {
    if(valid) {
    // output data
    $("#output").text(JSON.stringify(data, null, 2))
    } else {
    $("#output").text("Form is NOT VALID. Did you fill out all fields?")
    }
}

window.jsonForm.create("#Form1", formJson, "Form1")
window.jsonForm.registerSubmit(MyFormHandler, "Form1")