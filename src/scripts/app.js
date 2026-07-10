const initDomainName = `${window.location.origin}`;
const prefix = 'https://';
const domainName = initDomainName && initDomainName.indexOf(prefix) != -1  ? initDomainName.substring(prefix.length) : 'c8-labs.makelabs.in';
// default portal is 'c8-labs.makelabs.in';

const k8sConfig = {
    CLUSTER_NAME: "c8-labs-sravana-ap-21",
    REGION: "asia-south2",
    PROJECT_ID: "c8-labs"
};

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

const loadCoursePart = (part, specificView) => {
    console.log('Domain name is ' + domainName);
    console.log('page # is ' + part);
    console.log('specificView is ' + specificView);
    fetch(`pages/Part${part}.html`)
        .then(response => response.text())
        .then(async (data) => {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = data;

            // After loading, replace variables in code blocks (scoped to loaded content)
            const uNamespaceValue = getQueryParam('ns') || "undefined-namespace";
            const codeElements = mainContent.querySelectorAll('code');
            codeElements.forEach(codeBlock => {
              console.log(codeBlock.textContent);
              codeBlock.textContent = codeBlock.textContent.replace(/{{UNAMESPACE}}/g, uNamespaceValue);
              codeBlock.textContent = codeBlock.textContent.replace(/{{DOMAIN_NAME}}/g, domainName);

              // replace these 3 items as well
              codeBlock.textContent = codeBlock.textContent.replace(/{{CLUSTER_NAME}}/g, k8sConfig.CLUSTER_NAME);
              codeBlock.textContent = codeBlock.textContent.replace(/{{PROJECT_ID}}/g, k8sConfig.PROJECT_ID);
              codeBlock.textContent = codeBlock.textContent.replace(/{{REGION}}/g, k8sConfig.REGION);
            });

            // Count number of copy-block occurrences within the loaded content
            const copyBlockCount = mainContent.querySelectorAll('.copy-block').length;
            if (copyBlockCount > 0) {
              showNote(`This page has ${copyBlockCount} command-set instruction(s).`);
            }

            if (part == 0) {
                participants.sort((a, b) => a.name.localeCompare(b.name));
                renderStudentTable();
                attachGalleryModal();

                if (specificView){
                    // scroll to element if present
                    const element = document.getElementById('need-help');
                            if (element) {
                                element.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }
                }
            } else if (part == '1a') {
                attachInitOnboardingButton();
                metadataCheck();
            }
            // If Part7, fetch and inject the keys
            else if (part == 7) {
                // Check if namespace ends with 'pro-c8-labs' for premium access
                // Check if namespace ends with 'mls-c8-labs' for premium access
                const nsParam = getQueryParam('ns') || '';
                if (!nsParam.endsWith('pro-c8-labs') && !nsParam.endsWith('mls-c8-labs') ) {
                    // Replace section with premium access message
                    const section = mainContent.querySelector('section');
                    if (section) {
                        section.innerHTML = `
                            <div style="padding: 40px 20px; text-align: center; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #e8491d;">
                                <h3 style="color: #e8491d; margin-top: 0;">🔒 Premium Access Required</h3>
                                <p style="color: #666; font-size: 16px;">This section is available for Premium Access</p>
                                <p style="color: #999; font-size: 14px;">Please upgrade to Premium Tier to access Lab Exercise #b content.</p>
                            </div>
                        `;
                    }
                    return;
                }

                fetch(`https://${domainName}/fetchMyKeys`)
                    .then(resp => resp.text())
                    .then(html => {
                        console.log('Fetched keys:', html);
                        // Insert the fetched HTML into the code block
                        const codeBlock = document.querySelector('#copy-text-7-1 code');
                        if (codeBlock) { 
                            const indexOfToken = html.indexOf(domainName);
                            let token = indexOfToken !== -1 ?  html.substring(indexOfToken + domainName.length) : 'undefined';
                            token = ( token.length < 100 ) ? 'undefined' : token; // basic validation
                            codeBlock.innerHTML = token.trim();
                        }
                    });
            }
            else if (part == '9b' || part == '9c'){
                // Check if namespace ends with 'pro-c8-labs' for premium access
                const nsParam = getQueryParam('ns') || '';
                if (true && !nsParam.endsWith('pro-c8-labs')) {
                    // Replace section with premium access message
                    const section = mainContent.querySelector('section');
                    if (section) {
                        section.innerHTML = `
                            <div style="padding: 40px 20px; text-align: center; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #e8491d;">
                                <h3 style="color: #e8491d; margin-top: 0;">🔒 Premium Access Required</h3>
                                <p style="color: #666; font-size: 16px;">This section is available for Premium Access</p>
                                <p style="color: #999; font-size: 14px;">Please upgrade to Premium Tier to access Lab Exercise #b content.</p>
                            </div>
                        `;
                    }
                } else {
                    // Premium access granted - replace CF_TOKEN placeholders
                    const codeElements = mainContent.querySelectorAll('code');
                    const accessToken = await getMyAccessToken(false);
                    codeElements.forEach(codeBlock => {    
                        if (accessToken){
                            codeBlock.textContent = codeBlock.textContent.replace(/\$CF_TOKEN/g, accessToken );
                        }
                        else {
                            codeBlock.textContent = codeBlock.textContent.replace(/\$CF_TOKEN/g, "undefined-cf-token" );
                        }
                    });
                }
            }
            else if (part == 10) {
                attachshareToLinkedIn();
            }
            else if (part == 11){
                attachSupportMetadataButton(); // copy-text-11-1
            }
            else if (part == 12) {
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

// Load the appropriate course part on page load
window.addEventListener('DOMContentLoaded', async () => {
    const nsParam = getQueryParam('ns');

    if (true) {
        const accessToken = await getMyAccessToken(false);
        const hasAccess = !!accessToken && !!getEmailFromAccessJwt(accessToken);

        const onboardingJson = localStorage.getItem('c8-labs-onboarding');
        if (onboardingJson) {
            // at this step, if ns=value is present in the URL, lets replace it with actual namespace.
            const parsed = JSON.parse(onboardingJson);
            console.log('switching to ', parsed.namespace);
            const url = new URL(window.location.href);
            
            if (nsParam) url.searchParams.delete('ns');

            url.searchParams.set('ns', parsed.namespace);
            window.history.replaceState({}, '', url.toString());
            console.log('On refersh - with storage json - load 1a or H0me based on hasAccess: ' + hasAccess);
            loadCoursePart(hasAccess ? '1a' : 0);
        } else {
            console.log('On refersh - no storage json - load 1a or H0me based on hasAccess: ' + hasAccess);
            loadCoursePart(hasAccess ? '1a' : 0);
        }
        return;
    }

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

    const requestAccessButton = document.getElementById('request-access-btn');
    if (requestAccessButton) {
        requestAccessButton.addEventListener('click', () => {
            const signInUrl = '/signin';
            window.location.href = signInUrl;
        });
    }
});   

window.toggleAnswer = function(toggle) {
    const input = toggle.closest('label') ? toggle : toggle.closest('label')?.querySelector('input[type="checkbox"]');
    const checkbox = input instanceof HTMLInputElement ? input : null;
    const switchLabel = toggle.closest('label')?.querySelector('.switch-label');
    const answer = toggle.closest('.copy-block')?.querySelector('.answer-text');
    if (!checkbox || !answer) return;

    if (checkbox.checked) {
        answer.hidden = false;
        if (switchLabel) switchLabel.textContent = 'Hide Answer';
    } else {
        answer.hidden = true;
        if (switchLabel) switchLabel.textContent = 'Show Answer';
    }
};

function clearCache() {
  showNote('Clearing cache...');
  localStorage.removeItem('c8-labs-onboarding');

  const url = new URL(window.location.href);
  url.searchParams.delete('ns');
  window.history.replaceState({}, '', url.toString());

  showNote('Clearing cache...Done!');
}

function shareToLinkedIn(){
    // your portal URL
    const courseUrl = `https://${domainName}`;

    const linkedinUrl =
        "https://www.linkedin.com/sharing/share-offsite/?url=" +
        encodeURIComponent(courseUrl);

    copyToClipboard('copy-text-10-2', 'Post text copied to clipboard. Paste it into LinkedIn.');
    window.open(linkedinUrl, "_blank");
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
            // lets remove ns from URL if present, as metadata is not available
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('ns') !== null) {
                urlParams.delete('ns');
                const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
                window.history.replaceState({}, '', newUrl);
            }
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

function initializeOnboardingTurnstile() {
    const container = document.getElementById('turnstile-container');
    const button = document.getElementById('initOnboarding');
    const status = document.getElementById('turnstile-status');

    if (!container || !button || !status) return;

    if (window.turnstile && !container.dataset.rendered) {
        const siteKey = '0x4AAAAAADuFDLHjWaYBPzei';
        window.turnstile.render(container, {
            sitekey: siteKey,
            theme: 'light',
            callback: function() {
                button.disabled = false;
                button.classList.remove('disabled');
                status.textContent = 'Verification complete. You can now start onboarding.';
                status.classList.add('success');
            },
            'error-callback': function() {
                button.disabled = true;
                button.classList.add('disabled');
                status.textContent = 'Verification failed. Please refresh and try again.';
                status.classList.remove('success');
            },
            'expired-callback': function() {
                button.disabled = true;
                button.classList.add('disabled');
                status.textContent = 'Verification expired. Please complete it again.';
                status.classList.remove('success');
            }
        });
        container.dataset.rendered = 'true';
    } else if (!window.turnstile) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = function() {
            initializeOnboardingTurnstile();
        };
        document.body.appendChild(script);
    }
}

function attachInitOnboardingButton() {
    const button = document.getElementById('initOnboarding');
    if (!button) return;

    button.disabled = true;
    button.classList.add('disabled');
    initializeOnboardingTurnstile();

    button.onclick = function() {
        if (button.disabled) {
            showNote('Please complete the verification first.', 5000);
            return;
        }
        if (window.turnstile && !window.turnstile.getResponse()) {
            showNote('Please complete the verification first.', 5000);
            return;
        }
        sendOnboardingEmail();
    };

    console.log('Attached click event to onboarding button');
}

function attachClearCacheButton() {
    const button = document.getElementById('clearCache');
    if (!button) return;
    button.removeEventListener('click', clearCache);
    button.addEventListener('click', clearCache);
    console.log('Attached click event to clearCache button');
}

function attachGalleryModal() {
    const gallery = document.querySelector('.lab-gallery');
    const modalOverlay = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('gallery-modal-image');
    const modalCaption = document.getElementById('gallery-modal-description');
    const modalCounter = document.getElementById('gallery-modal-counter');

    const closeBtn = document.getElementById('gallery-modal-close');
    const prevBtn = document.getElementById('gallery-modal-prev');
    const nextBtn = document.getElementById('gallery-modal-next');

    if ( !gallery || !modalOverlay || !modalImage || !modalCaption || !modalCounter || !closeBtn || !prevBtn || !nextBtn) {
        return;
    }

    const items = Array.from(gallery.querySelectorAll('.lab-gallery-item img'));
    if (!items.length) return;

    const galleryData = items.map(img => ({
        src: img.src,
        alt: img.alt || 'Gallery image',
        index: Number(img.dataset.galleryIndex || 0)
    }));

    let currentIndex = 0;

    function updateModal(index) {
        currentIndex = (index + galleryData.length) % galleryData.length;
        const item = galleryData[currentIndex];
        modalImage.src = item.src;
        modalImage.alt = item.alt;
        modalCaption.textContent = item.alt; 
        modalCounter.textContent = `${currentIndex + 1} of ${galleryData.length}`;
    }

    function openModal(index) {
        updateModal(index);
        modalOverlay.hidden = false;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.hidden = true;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    items.forEach((img, idx) => {
        img.addEventListener('click', () => openModal(idx));
    });

    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => updateModal(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateModal(currentIndex + 1));

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (modalOverlay.hidden) return;
        if (event.key === 'Escape') {
            closeModal();
        }
        if (event.key === 'ArrowLeft') {
            updateModal(currentIndex - 1);
        }
        if (event.key === 'ArrowRight') {
            updateModal(currentIndex + 1);
        }
    });

    console.log('Attached gallery modal events');
}

function attachSupportMetadataButton() { // copy-text-11-1
    const button = document.getElementById('copy-text-11-1');
    if (!button) return;
    button.removeEventListener('click', supportMetadata() );
    button.addEventListener('click', supportMetadata());
    console.log('Attached click event to copy-text-11-1 support metadata button');
    copyToClipboard('copy-text-11-1', "Support Metadata for your account copied");
}

function supportMetadata(){
    const onboardingJson = localStorage.getItem('c8-labs-onboarding');
    if (onboardingJson) {
        try {
            const parsed = JSON.parse(onboardingJson);
            const supportMetadataTextbox = document.getElementById('copy-text-11-1');
            if (!supportMetadataTextbox) return;
            supportMetadataTextbox.innerText = JSON.stringify(parsed, null, 2);
            copyToClipboard('copy-text-11-1', "Metadata copied");
        }catch(error){ 
            console.log(error); 
            showNote("Unable to copy Metadata");
        }
    } else { 
        showNote("Metadata not available. Please send your query without metadata."); 
    }
}

function attachshareToLinkedIn(){
    
    const button = document.getElementById('shareToLinkedIn');
    if (!button) return;
    button.removeEventListener('click', shareToLinkedIn);
    button.addEventListener('click', shareToLinkedIn);
    console.log('Attached click event to shareToLinkedIn button');
}

// init onboarding for the user
async function sendOnboardingEmail() {
    // Reset the service log
    const codeBlock = document.querySelector('#copy-text-1a-1 code');
    codeBlock.innerHTML = 'Running ...';
        
    const currentToken = await getMyAccessToken(true);
    if (!currentToken) {
        showNote('Unable to retrieve access token.', 9000);
        codeBlock.innerHTML = 'Error #1: Invalid access token. Please try sign-in again. If issue persists, contact administrator.' ;
        return;
    }

    const email = getEmailFromAccessJwt(currentToken);
    if (!email) {
        showNote('Unable to extract email from token.', 9000);
        codeBlock.innerHTML = 'Error #2: Invalid access token. Please try sign-in again. If issue persists, contact administrator.' ;
        return;
    }

    // lets post v1 msg - needs community api access
    if (false)
        fetch(`https://${domainName}/postItV1`)
        .then( r => { 
            if (r.ok)
                console.log("Post It v1 complete!"); 
            else 
                console.log("Post It error - ", e);
        } )
        .catch( e => {
            console.error("Post It error - ", e);
        });

    const url = 'https://cep-api-gw-7k5bxais.an.gateway.dev/labsOnboarding';
    const urlSendMail = 'https://cep-api-gw-7k5bxais.an.gateway.dev/sendEmail';

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
                showNote('Saving onboarding metadata');
                localStorage.setItem('c8-labs-onboarding', JSON.stringify(result.data));
                showNote('Sending confirmation email');
                const payload = {
                    to: email,
                    content: 'You are now onboarded to C8 Labs environment - GKE Cluster.<br/>'
                              + 'Browser onboarding initiated at ' + new Date().toISOString() + '<p/>'
                              + 'Your access is for a limited period only. For details, please visit the site below. If you have any questions, please contact administrator.' 
                              + '<p><a href="https://c8-labs.makelabs.in/#access-plans" target="_blank">C8 Labs Access Plans</a></p>'
                              + '<p>Below are user accounts associated with your Camunda 8 app components. As you complete the installation, please sign-in using these credentials.</p>'
                              + '<p><b>Camunda Orchestration - Orchestration Admin / Operate / Tasklist</b><br/><span>demo and makelabs</span></p>'
                              + '<p><b>Camunda Management apps - Identity / Console / Optimize</b><br/><span>demo and makelabs</span></p>'
                              + '<p><b>Keycloak IAM</b><br/><span>admin and makelabs</span></p>'
                              + '<p><b>Grafana</b><br/><span>admin and makelabs</span></p>'
                              + '<p><pre style="font-family: monospace; white-space: pre-wrap; background:#f5f5f5; padding:10px; border-radius:4px;">'
                              + escapeHtml(JSON.stringify(result.data, null, 2))
                              + '</pre></p>',
                    subject: 'Onboarding - C8 Learning and Enablement'
                };                
                fetch(urlSendMail, {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'x-api-key' : currentToken,
                              'Authorization': 'Bearer ' + currentToken
                          },
                          body : JSON.stringify(payload)
                      }).then( (opResponse) => 
                      {
                          if (opResponse.ok) showNote('Sending confirmation email...Done!');
                          
                          metadataCheck();
                      });
                
            } catch (storageError) {
                console.warn('Unable to save onboarding data to localStorage:', storageError);
                throw storageError;
            }
        })
        .catch(error => {
            console.error('Failed to invoke onboarding API:', error);
            showNote('Failed to onboard user. See console for details.', 9000);

            codeBlock.innerHTML = 'service status: error' 
                                  + '<br/>' + error;
        });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

async function getMyAccessToken(postIt) {
  const url = `https://${domainName}/fetchMyKeys`;

  return fetch(url)
      .then(resp => resp.text())
      .then(html => {
          console.log('Fetched keys:', html);
          const indexOfToken = html.indexOf(domainName);
          let token = indexOfToken !== -1 ? html.substring(indexOfToken + domainName.length) : null;
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
  try{
    const payload = jwt.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded).email || 'contact@makelabs.in';
  }catch(e) {return null;}
  
}
