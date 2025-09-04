const header = document.createElement('header');
header.innerHTML = `
`;

const footer = document.createElement('footer');
footer.innerHTML = `
    <p><small>&copy; 2025 MakeLabs.in All rights reserved. For any query or feedback, write to <code>contact@makelabs.in</code></small></p>
`;

document.body.appendChild(header);
document.body.appendChild(footer);

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

const loadCoursePart = (part) => {
    fetch(`pages/Part${part}.html`)
        .then(response => response.text())
        .then(data => {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = data;

            // After loading, replace variables in code blocks
            const UNAMESPACE_VALUE = getQueryParam('ns') || "undefined-namespace";
            document.querySelectorAll('code').forEach(codeBlock => {
                console.log(codeBlock.textContent);
                codeBlock.textContent = codeBlock.textContent.replace(/\$UNAMESPACE/g, UNAMESPACE_VALUE);
            });

            if (part == 0) {
                renderStudentTable();
            }

            // If Part7, fetch and inject the keys
            if (part == 7) {
                fetch('https://c8-portal.makelabs.in/fetchMyKeys')
                    .then(resp => resp.text())
                    .then(html => {
                        console.log('Fetched keys:', html);
                        // Insert the fetched HTML into the code block
                        const codeBlock = document.querySelector('#copy-text-7-1 code');
                        if (codeBlock) { 
                            const indexOfToken = html.indexOf('c8-portal.makelabs.in');
                            let token = indexOfToken !== -1 ?  html.substring(indexOfToken+21) : 'undefined';
                            token = ( token.length < 100 ) ? 'undefined' : token; // basic validation
                            codeBlock.innerHTML = token.trim();
                        }
                    });
            }            
            
        })
        .catch(error => console.error('Error loading course part:', error));
};

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const part = event.target.getAttribute('href').match(/Part(\d+)/)[1];
        loadCoursePart(part);
    });
});

// Load Part0.html by default on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCoursePart(0);
});

document.addEventListener('DOMContentLoaded', function() {
    
    // Enhance copyToClipboard to always copy the displayed text
    window.copyToClipboard = function(elementId, messageToShow) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const text = el.innerText || el.textContent;
        navigator.clipboard.writeText(text.trim());
        if (messageToShow) showNote(messageToShow);
    }        
});   

function showNote(message, duration = 7000) {
    let note = document.getElementById('temp-note');
    if (!note) {
        note = document.createElement('div');
        note.id = 'temp-note';
        note.style.position = 'fixed';
        note.style.bottom = '30px';
        note.style.left = '50%';
        note.style.transform = 'translateX(-50%)';
        note.style.background = '#e8491d';
        note.style.color = '#fff';
        note.style.padding = '12px 24px';
        note.style.borderRadius = '6px';
        note.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        note.style.fontSize = '1.4em';
        note.style.zIndex = '9999';
        document.body.appendChild(note);
    }
    note.textContent = message;
    note.style.display = 'block';
    setTimeout(() => {
        note.style.display = 'none';
    }, duration);
}

const participants = [
    {
        name: "Anmol",
        email: "anm****@gmail.com",
        ns: "c8-labs-30"
    },
    {
        name: "Prasad",
        email: "pra****@gmail.com",
        ns: "c8-labs-31"
    },
    {
        name: "Raghavendra",
        email: "rag****@gmail.com",
        ns: "c8-labs-32"
    },    
    // Add more participants as needed
];

function renderStudentTable() {
    const tbody = document.getElementById('studentTable');
    if (!tbody) return;
    tbody.innerHTML = participants.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.email}</td>
            <td><a href="/?ns=${p.ns}">Link</a></td>
        </tr>
    `).join('');
}
