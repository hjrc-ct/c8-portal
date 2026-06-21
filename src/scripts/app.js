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
                attachInitOnboardingButton();
                metadataCheck();

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

            if (part == 10) {
                attachClearCacheButton();
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
        const partMatch = event.currentTarget.getAttribute('href').match(/Part(\d+[a-zA-Z]*)/);
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

function clearCache() {
  showNote('Clearing cache...');
  localStorage.removeItem('c8-labs-onboarding');
  showNote('Clearing cache...Done!');
}

function metadataCheck() {

    // pre load metadata if available
    const codeBlock = document.querySelector('#copy-text-1a-1 code');
    if (codeBlock) {
        const onboardingJson = localStorage.getItem('c8-labs-onboarding');
        if (onboardingJson) {
            try {
                const parsed = JSON.parse(onboardingJson);
                codeBlock.textContent = JSON.stringify(parsed, null, 2);
                // disable button initOnboarding as metadata is present
                const initButton = document.getElementById('initOnboarding');
                if (initButton) {
                    initButton.disabled = true;
                    initButton.textContent = 'Onboarding Complete!';
                    initButton.classList.add('disabled');
                }
                const urlParams = new URLSearchParams(window.location.search);
                if (parsed.namespace && 
                  (urlParams.get('ns') === null || urlParams.get('ns') === undefined )) {
                  console.log('Redirect to ns ' + `${window.location.origin}/?ns=${encodeURIComponent(parsed.namespace)}` );
                  window.location.replace(`${window.location.origin}/?ns=${encodeURIComponent(parsed.namespace)}`);
                }
            } catch (parseError) {
                codeBlock.textContent = onboardingJson;
            }
        } else {
            codeBlock.innerHTML = '';
        }
    }  
}

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
    "email": "r****************@gmail.com",
    "ns": "c8-labs-hampi"
  },
  {
    "name": "Raghu",
    "email": "r****************@mdpalumni.iimcal.ac.in",
    "ns": "c8-labs-jolt"
  },
  {
    "name": "Raghu HJ",
    "email": "r****************@gmail.com",
    "ns": "c8-labs-kia"
  },
  {
    "name": "Ashwini Mallela",
    "email": "a****************@gmail.com",
    "ns": "c8-labs-41"
  },
  {
    "name": "Kalanithi K",
    "email": "k****************@gmail.com",
    "ns": "c8-labs-42"
  },
  {
    "name": "Vijay Kumar",
    "email": "k****************@gmail.com",
    "ns": "c8-labs-43"
  },
  {
    "name": "Navya Sri",
    "email": "n****************@gmail.com",
    "ns": "c8-labs-44"
  },
  {
    "name": "Rasheeda Shaik",
    "email": "r****************@gmail.com",
    "ns": "c8-labs-45"
  },
  {
    "name": "Venkat Rao",
    "email": "w****************@gmail.com",
    "ns": "c8-labs-46"
  },
  {
    "name": "Sanjay Jain",
    "email": "s****************@gmail.com",
    "ns": "c8-labs-47"
  },
  {
    "name": "slmahavadi",
    "email": "s****************@gmail.com",
    "ns": "c8-labs-48"
  },
  {
    "name": "A Srihari Kiran",
    "email": "a****************@gmail.com",
    "ns": "c8-labs-49"
  },
  {
    "name": "vyassidhi70",
    "email": "v****************@gmail.com",
    "ns": "c8-labs-50"
  },
  {
    "name": "Shrridhar BMS",
    "email": "b****************@gmail.com",
    "ns": "c8-labs-51"
  },
  {
    "name": "ppentakotabc",
    "email": "p****************@gmail.com",
    "ns": "c8-labs-52"
  },
  {
    "name": "Vikas R",
    "email": "v****************@gmail.com",
    "ns": "c8-labs-53"
  },
  {
    "name": "Kushal S",
    "email": "s****************@gmail.com",
    "ns": "c8-labs-54"
  },
  {
    "name": "Praneeth K",
    "email": "p****************@gmail.com",
    "ns": "c8-labs-55"
  },
  {
    "name": "Vishnu V",
    "email": "v****************@gmail.com",
    "ns": "c8-labs-56"
  },
  {
    "name": "G Jeevan kumar",
    "email": "g****************@gmail.com",
    "ns": "c8-labs-57"
  },
  {
    "name": "M Vinay",
    "email": "m****************@gmail.com",
    "ns": "c8-labs-58"
  },
  {
    "name": "Rajender",
    "email": "r****************@gmail.com",
    "ns": "c8-labs-59"
  },
  {
    "name": "Eshwar",
    "email": "e****************@gmail.com",
    "ns": "c8-labs-60"
  },
  {
    "name": "rawtiya",
    "email": "r****************@gmail.com",
    "ns": "c8-labs-61"
  },
  {
    "name": "Vijay MCA",
    "email": "p****************@gmail.com",
    "ns": "c8-labs-62"
  },
  {
    "name": "Siva Puvvada",
    "email": "s****************@gmail.com",
    "ns": "c8-labs-63"
  },
  {
    "name": "Ravi Shetty",
    "email": "r****************@gmail.com",
    "ns": "c8-labs-64"
  },
  {
    "name": "G S Rao",
    "email": "g****************@gmail.com",
    "ns": "c8-labs-65"
  },
  {
    "name": "Karthik V",
    "email": "k****************@gmail.com",
    "ns": "c8-labs-66"
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

function attachInitOnboardingButton() {
    const button = document.getElementById('initOnboarding');
    if (!button) return;
    button.removeEventListener('click', sendOnboardingEmail);
    button.addEventListener('click', sendOnboardingEmail);
    console.log('Attached click event to onboarding button');
}

function attachClearCacheButton() {
    const button = document.getElementById('clearCache');
    if (!button) return;
    button.removeEventListener('click', clearCache);
    button.addEventListener('click', clearCache);
    console.log('Attached click event to clearCache button');
}

// init onboarding for the user
async function sendOnboardingEmail() {
    // Reset the service log
    const codeBlock = document.querySelector('#copy-text-1a-1 code');
    codeBlock.innerHTML = 'Running ...';
        
    const currentToken = await getMyAccessToken();
    if (!currentToken) {
        showNote('Unable to retrieve access token.', 9000);
        return;
    }

    const email = getEmailFromAccessJwt(currentToken);
    if (!email) {
        showNote('Unable to extract email from token.', 9000);
        return;
    }

    const url = 'https://cep-api-gw-7k5bxais.an.gateway.dev/labsOnboarding';
    const payload = {
        to: email,
        content: 'You are now onboarded to C8 Labs environment.<br/>' + new Date().toISOString(),
        subject: 'Onboarding - C8 Learning and Enablement'
    };

    showNote('Invoke onboarding ...', 12000);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key' : currentToken,
            'Authorization': 'Bearer ' + currentToken
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Status ${response.status}: ${text}`);
                });
            }
            return response.json().catch(() => ({ success: true }));
        })
        .then(result => {
            console.log('Onboarding API response:', result);
            showNote('Onboarding API invoked successfully. ' + result.message );

            codeBlock.innerHTML = 'service status: ' + result.status 
                + '<br/>' + result.message
                + '<br/>Namespace ' + result.data.namespace
                + '<br/>Account provisioned for ' + result.data.email
                + '<br/>';
            // Store the result.data payload in local storage for later use
            try {
                localStorage.setItem('c8-labs-onboarding', JSON.stringify(result.data));
                metadataCheck();
            } catch (storageError) {
                console.warn('Unable to save onboarding data to localStorage:', storageError);
            }
        })
        .catch(error => {
            console.error('Failed to invoke onboarding API:', error);
            showNote('Failed to onboard user. See console for details.', 9000);

            codeBlock.innerHTML = 'service status: error' 
                                  + '<br/>' + error;
        });
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

async function getMyAccessToken() {
  return fetch('https://c8-portal.makelabs.in/fetchMyKeys')
      .then(resp => resp.text())
      .then(html => {
          console.log('Fetched keys:', html);
          const indexOfToken = html.indexOf('c8-portal.makelabs.in');
          let token = indexOfToken !== -1 ? html.substring(indexOfToken + 21) : null;
          if (!token || token.length < 100) {
              return null;
          }
          console.log('Extracted token:', token.trim());
          return token.trim();
      })
      .catch(error => {
          console.error('Failed to fetch access token:', error);
          return null;
      });
}

function getEmailFromAccessJwt(jwt) {
  const payload = jwt.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded).email || 'contact@makelabs.in';
  
}
