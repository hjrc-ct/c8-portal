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
                participants.sort((a, b) => a.name.localeCompare(b.name));
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


        // Remove active class from all links
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('nav-active'));

        // Add active class to the clicked link
        event.currentTarget.classList.add('nav-active');

        // Your existing code to load the part
        const partMatch = event.currentTarget.getAttribute('href').match(/Part(\d+)/);
        if (partMatch) {
            loadCoursePart(partMatch[1]);
        } else if (event.currentTarget.getAttribute('href').includes('Part0.html')) {
            loadCoursePart(0);
        }
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
        else showNote('Copied to clipboard!');
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

const participants = 
[
    {
        "name": "R Chari",
        "email": "r****@gmail.com",
        "ns": "c8-labs-32"
    },
    {
        "name": "A Gupta",
        "email": "g****@gmail.com",
        "ns": "c8-labs-31"
    },
    {
        "name": "R Chari",
        "email": "r****@mdpalumni.iimcal.ac.in",
        "ns": "c8-labs-30"
    },
    {
        "name": "gulshan k",
        "email": "g****@gmail.com",
        "ns": "c8-labs-41"
    },
    {
        "name": "harmesh m",
        "email": "h****@gmail.com",
        "ns": "c8-labs-42"
    },
    {
        "name": "prabir b",
        "email": "p****@gmail.com",
        "ns": "c8-labs-43"
    },
    {
        "name": "balaji b g",
        "email": "b****@gmail.com",
        "ns": "c8-labs-44"
    },
    {
        "name": "tomas w",
        "email": "t****@gmail.com",
        "ns": "c8-labs-45"
    },
    {
        "name": "meghana r",
        "email": "m****@gmail.com",
        "ns": "c8-labs-46"
    },
    {
        "name": "anitha j",
        "email": "a****@gmail.com",
        "ns": "c8-labs-47"
    },
    {
        "name": "venkata s",
        "email": "n****@gmail.com",
        "ns": "c8-labs-50"
    },
    {
        "name": "priyadharshni k",
        "email": "p****@sandhata.com",
        "ns": "c8-labs-51"
    },
    {
        "name": "surya r",
        "email": "s****@gmail.com",
        "ns": "c8-labs-52"
    },
    {
        "name": "hariharan r",
        "email": "h****@gmail.com",
        "ns": "c8-labs-53"
    },
    {
        "name": "nishant r",
        "email": "n****@gmail.com",
        "ns": "c8-labs-54"
    },
    {
        "name": "suryam b",
        "email": "b****@gmail.com",
        "ns": "c8-labs-55"
    },
    {
        "name": "ameyl p",
        "email": "a****@gmail.com",
        "ns": "c8-labs-56"
    },
    {
        "name": "subhrajyoti d",
        "email": "s****@gmail.com",
        "ns": "c8-labs-57"
    },
    {
        "name": "santhosh a",
        "email": "s****@tcs.com",
        "ns": "c8-labs-58"
    },
    {
        "name": "swathi p",
        "email": "s****@gmail.com",
        "ns": "c8-labs-59"
    },
    {
        "name": "prasad d b",
        "email": "p****@gmail.com",
        "ns": "c8-labs-60"
    },
    {
        "name": "pallam c",
        "email": "p****@gmail.com",
        "ns": "c8-labs-61"
    },
    {
        "name": "subhranshu m",
        "email": "s****@gmail.com",
        "ns": "c8-labs-62"
    },
    {
        "name": "umakant s",
        "email": "u****@gmail.com",
        "ns": "c8-labs-63"
    },
    {
        "name": "raja m",
        "email": "r****@gmail.com",
        "ns": "c8-labs-64"
    },
    {
        "name": "janarthanan n",
        "email": "j****@tcs.com",
        "ns": "c8-labs-65"
    },
    {
        "name": "manasa g",
        "email": "m****@tcs.com",
        "ns": "c8-labs-66"
    },
    {
        "name": "janakiraman g",
        "email": "j****@gmail.com",
        "ns": "c8-labs-67"
    },
    {
        "name": "prosanto g",
        "email": "g****@gmail.com",
        "ns": "c8-labs-68"
    },
    {
        "name": "raji m",
        "email": "r****@gmail.com",
        "ns": "c8-labs-69"
    },
    {
        "name": "thanmai c",
        "email": "t****@gmail.com",
        "ns": "c8-labs-70"
    },
    {
        "name": "ramesh b s",
        "email": "s****@gmail.com",
        "ns": "c8-labs-71"
    },
    {
        "name": "tamilmani p",
        "email": "t****@gmail.com",
        "ns": "c8-labs-72"
    },
    {
        "name": "hariharan b",
        "email": "h****@gmail.com",
        "ns": "c8-labs-73"
    },
    {
        "name": "jignesh p",
        "email": "p****@gmail.com",
        "ns": "c8-labs-74"
    },
    {
        "name": "vikas k",
        "email": "v****@hcltech.com",
        "ns": "c8-labs-75"
    },
    {
        "name": "prakruthi k v",
        "email": "p****@gmail.com",
        "ns": "c8-labs-76"
    },
    {
        "name": "vikash g",
        "email": "v****@gmail.com",
        "ns": "c8-labs-77"
    },
    {
        "name": "satyam s",
        "email": "s****@gmail.com",
        "ns": "c8-labs-78"
    },
    {
        "name": "devender y",
        "email": "d****@gmail.com",
        "ns": "c8-labs-79"
    },
    {
        "name": "aman k",
        "email": "a****@perfios.com",
        "ns": "c8-labs-80"
    },
    {
        "name": "sugam p",
        "email": "s****@gmail.com",
        "ns": "c8-labs-81"
    }
]
;

function renderStudentTable() {
    const tbody = document.getElementById('studentTable');
    if (!tbody) return;
    tbody.innerHTML = participants.map(p => `
        <tr>
            <td>${toTitleCase(p.name)}</td>
            <td>${p.email}</td>
            <td><a href="/?ns=${p.ns}">${p.ns}</a></td>
        </tr>
    `).join('');
}

function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
