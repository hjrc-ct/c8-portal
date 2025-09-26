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
        "name": "A Gupta",
        "email": "g***********@gmail.com",
        "ns": "c8-labs-31"
    },
    {
        "name": "a renish",
        "email": "a*******@gmail.com",
        "ns": "c8-labs-grape"
    },
    {
        "name": "adi m",
        "email": "a**********@gmail.com",
        "ns": "c8-labs-pine"
    },
    {
        "name": "amit b",
        "email": "a*********@gmail.com",
        "ns": "c8-labs-stone"
    },
    {
        "name": "amit j",
        "email": "a********@gmail.com",
        "ns": "c8-labs-sydney"
    },
    {
        "name": "ankan j",
        "email": "j*******@gmail.com",
        "ns": "c8-labs-hill"
    },
    {
        "name": "anoop k v",
        "email": "a**************@gmail.com",
        "ns": "c8-labs-oak"
    },
    {
        "name": "anurag g",
        "email": "a********@gmail.com",
        "ns": "c8-labs-wolf"
    },
    {
        "name": "ashish d",
        "email": "a***********@gmail.com",
        "ns": "c8-labs-peach"
    },
    {
        "name": "aswathi k k",
        "email": "k**********@gmail.com",
        "ns": "c8-labs-drum"
    },
    {
        "name": "francis p",
        "email": "f**************@gmail.com",
        "ns": "c8-labs-berry"
    },
    {
        "name": "gaurav m",
        "email": "m**************@gmail.com",
        "ns": "c8-labs-rose"
    },
    {
        "name": "gopinadh u",
        "email": "t********************@gmail.com",
        "ns": "c8-labs-sky"
    },
    {
        "name": "gowtham m",
        "email": "g***********@gmail.com",
        "ns": "c8-labs-three"
    },
    {
        "name": "harish g",
        "email": "g***************@gmail.com",
        "ns": "c8-labs-delhi"
    },
    {
        "name": "hasan g",
        "email": "r****************@gmail.com",
        "ns": "c8-labs-moon"
    },
    {
        "name": "hiren p",
        "email": "h***********@gmail.com",
        "ns": "c8-labs-tin"
    },
    {
        "name": "jagadeesh k",
        "email": "j****************@gmail.com",
        "ns": "c8-labs-lotus"
    },
    {
        "name": "jayant k",
        "email": "j************@gmail.com",
        "ns": "c8-labs-four"
    },
    {
        "name": "joy p",
        "email": "j********@gmail.com",
        "ns": "c8-labs-copper"
    },
    {
        "name": "kavya k",
        "email": "k************@gmail.com",
        "ns": "c8-labs-beat"
    },
    {
        "name": "lokesh  s",
        "email": "l***********@gmail.com",
        "ns": "c8-labs-lion"
    },
    {
        "name": "mithil w",
        "email": "m*********@gmail.com",
        "ns": "c8-labs-crow"
    },
    {
        "name": "momen a",
        "email": "m***************@gmail.com",
        "ns": "c8-labs-frog"
    },
    {
        "name": "nythika a",
        "email": "n*************@tcs.com",
        "ns": "c8-labs-lily"
    },
    {
        "name": "pandurang m",
        "email": "p********************@gmail.com",
        "ns": "c8-labs-tiger"
    },
    {
        "name": "paritala k",
        "email": "p***********@gmail.com",
        "ns": "c8-labs-rome"
    },
    {
        "name": "praneet v",
        "email": "p*************@tcs.com",
        "ns": "c8-labs-lemon"
    },
    {
        "name": "pruthvi r",
        "email": "r********@gmail.com",
        "ns": "c8-labs-river"
    },
    {
        "name": "R Chari",
        "email": "r****************@gmail.com",
        "ns": "c8-labs-32"
    },
    {
        "name": "R Chari",
        "email": "r*******************@mdpalumni.iimcal.ac.in",
        "ns": "c8-labs-30"
    },
    {
        "name": "rahul k",
        "email": "r************@nagarro.com",
        "ns": "c8-labs-ten"
    },
    {
        "name": "rashmica m",
        "email": "m*********@tcs.com",
        "ns": "c8-labs-lava"
    },
    {
        "name": "sagar g",
        "email": "n***********@gmail.com",
        "ns": "c8-labs-guava"
    },
    {
        "name": "sahil k",
        "email": "r****************@gmail.com",
        "ns": "c8-labs-nickel"
    },
    {
        "name": "sampath k",
        "email": "k****************@gmail.com",
        "ns": "c8-labs-horn"
    },
    {
        "name": "sayali j",
        "email": "s****************@gmail.com",
        "ns": "c8-labs-two"
    },
    {
        "name": "shoeb s",
        "email": "s*************@gmail.com",
        "ns": "c8-labs-fish"
    },
    {
        "name": "shufyan k",
        "email": "s**********@gmail.com",
        "ns": "c8-labs-kite"
    },
    {
        "name": "siva n k",
        "email": "n**************@gmail.com",
        "ns": "c8-labs-gold"
    },
    {
        "name": "siva p",
        "email": "w************@gmail.com",
        "ns": "c8-labs-banana"
    },
    {
        "name": "siva p",
        "email": "s***********@gmail.com",
        "ns": "c8-labs-paris"
    },
    {
        "name": "subba r k",
        "email": "k***********@gmail.com",
        "ns": "c8-labs-kyoto"
    },
    {
        "name": "surbhi g",
        "email": "g*************@gmail.com",
        "ns": "c8-labs-sun"
    },
    {
        "name": "t prakasam",
        "email": "t************@gmail.com",
        "ns": "c8-labs-tulip"
    },
    {
        "name": "umesh s",
        "email": "u*********@gmail.com",
        "ns": "c8-labs-dove"
    },
    {
        "name": "vaishnavi c",
        "email": "v******************@gmail.com",
        "ns": "c8-labs-jazz"
    },
    {
        "name": "vibha c",
        "email": "v****************@mercedes-benz.com",
        "ns": "c8-labs-bell"
    },
    {
        "name": "vikas k",
        "email": "k*************@gmail.com",
        "ns": "c8-labs-fox"
    },
    {
        "name": "vineet s",
        "email": "s*************@gmail.com",
        "ns": "c8-labs-star"
    },
    {
        "name": "yoganandan a",
        "email": "y************@tcs.com",
        "ns": "c8-labs-camel"
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
