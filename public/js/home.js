let quill;
document.addEventListener("DOMContentLoaded", () => {
    fetch("/messages", {
        method: "GET",
    })
    .then(r => r.json())
    .then(function (data) {
        for (let message of data) {
            appendMessage(message.username, message.content, message.datetime);
        }
    });

    quill = new Quill("#message-input", {
        theme: "snow",
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['clean']
            ]
        }
    });
});

//websocket comm stuff 
document.addEventListener('DOMContentLoaded', async function () {
    const user = await fetch("/user", {
        method: "GET",
    })
        .then(function (response) {
            return response.json();
        });

    const ws = new WebSocket('ws://localhost:3000/messages?user=' + encodeURIComponent(user.username));

    ws.onopen = function () {
        console.log('WebSocket Client Connected');
    };

    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        appendMessage(message.username, message.content, message.datetime);
    };


    document.getElementById('sendButton').addEventListener('click', function () {
        let message = quill.getContents().ops;
        ws.send(JSON.stringify(message));
        quill.deleteText(0, quill.getLength(), "api");
    });
});

function appendMessage(username, content, datetime) {
    const wrapper = document.createElement("div");
    const quillReadOnly = new Quill(wrapper, {
        placeholder: 'MESSAGE EMPTY',
        readOnly: true,
        theme: 'snow'
    });
    
    let toAppend = [{insert: `${username}\n`}];
    try {
        toAppend = toAppend.concat(JSON.parse(content));
    } catch(_) {
        toAppend.push({insert: content + "\n"});
    }
    toAppend.push({insert: `${datetime}`});
    console.log(toAppend);
    quillReadOnly.setContents(toAppend);
    document.querySelector("#message-display").appendChild(wrapper);
}