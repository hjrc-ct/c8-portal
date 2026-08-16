const accessPlan = "Premium"; // selected access plan
var amount = 0;
var amountOriginal = 0;
var currency = 'INR';
var appTxnId = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
const upiId=encodeURIComponent("makelabs@sbi");
const remarks = 'Payment+for+C8+Kubernetes+Labs+on+GCP';
const whatsappNumber = "918217538171"; // arica whatsapp handler
const waInput = `c8k8s ${appTxnId}`;
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waInput)}`;

function getUPIUrl(){
    var  upi = "upi://pay?" 
                + `pa=${upiId}&cu=${currency}`
                + `&am=${getPaymentAmount()}
`                + `&tn=${remarks}`
                + `&tr=${appTxnId}`;
    return upi;    
}

function getPaymentAmount(selectedCurrency = currency) {
    const normalizedCurrency = selectedCurrency || currency || 'INR';
    return normalizedCurrency === 'INR'
        ? Number(amount).toLocaleString('en-IN')
        : Number(amount).toLocaleString('en-US');
}

function getPaymentAmountOriginal(selectedCurrency = currency) {
    const normalizedCurrency = selectedCurrency || currency || 'INR';
    return normalizedCurrency === 'INR'
        ? Number(amountOriginal).toLocaleString('en-IN')
        : Number(amountOriginal).toLocaleString('en-US');
}

function getPaymentTxnId()    { return decodeURIComponent(appTxnId); }
function getPaymentId()       { return decodeURIComponent(upiId);    }
function getPaymentCurrency() { return currency == 'INR' ? '₹' : '$'; }
async function setPaymentCurrency(c) {
    currency = (c === 'USD' ? 'USD' : 'INR');
    if (currency === 'INR') {
        amount = 1999;
        amountOriginal = 12999;
    } else {
        amount = 20;
        amountOriginal = 120;
    }
    return currency;
}
function getPaymentRemarks()  { return decodeURIComponent(remarks.replace(/\+/g, " "));  }


async function showQR() {
    // disable the button
    document.getElementById("showQR").disabled = true;
    document.getElementById("showQR").style.background = 'gray';

    // render the container with qr images
    document.getElementById("qrContainer").style.display="inline-flex";

    // remove hidden flag
    document.getElementById("qrUPIContainer").style.display="block";
    document.getElementById("qrWhatsAppContainer").style.display="block";
    document.getElementById("qrUPIContainer").hidden=false;
    document.getElementById("qrWhatsAppContainer").hidden=false;

    document.getElementById("qrUPI").innerHTML="";
    document.getElementById("qrWhatsApp").innerHTML="";

    const upiUrl = getUPIUrl();

    // Show this QR code for INR only
    if(currency === 'INR'){
        new QRCode(
            document.getElementById("qrUPI"),
            {
            text:upiUrl,
            width:240,
            height:240
            } );
    } else {
        // lets send an email with Bank Transfer details - TODO
        const accessToken = await getMyAccessToken(false);
        const participantEmail = accessToken ? getEmailFromAccessJwt(accessToken) : 'unknown user';
        sendBankInfo(appTxnId, participantEmail, accessToken);
    }

    new QRCode(
        document.getElementById("qrWhatsApp"),
        {
        text:whatsappUrl,
        width:240,
        height:240
        } );    

    document.getElementById("qrContainer-txn-id").innerHTML=`
        <hr/>
        <b>Instructions - Make the payment</b><br/>
        ${currency === 'INR'
        ? '(a) Scan <code>UPI QR</code> to make the payment.<br/>'
        : '(a) Use <code>bank transfer</code> details sent to your email and make the payment.<br/>'}
        <br/>
        <b>Instructions - WhatsApp</b><br/>
        (b) Next, scan WhatsApp QR code and <code>send the pre-configured message as-is</code> to the Arica number. Wait for acknowledgement - upto 10 seconds.<br/>
        ${currency === 'INR'
        ? '(c) Send the <code>UPI payment receipt image</code> to the Arica number.<br/>'
        : '(c) Send the <code>Bank Transfer payment receipt image</code> to the Arica number.<br/>'
        }
        (d) Click on <code>Generate PDF</code> button in WhatsApp to generate the payment receipt.<br/>
        (e) The backend may take upto a minute or so, but you may proceed.<br/>
        <br/>
        <b>Instructions - <code>Complete Payment</code></b><br/>
        ${currency === 'INR'
        ? '(f) Enter the last 6 characters of your <code>UPI Transaction Id</code> and click <code>Complete Payment</code> to proceed to onboarding.'
        : '(f) Enter the last 6 characters of your <code>Bank Payment Transaction Id</code> and click <code>Complete Payment</code> to proceed to onboarding.'
        }
        <br/><br/>

        <label>
            <input type="checkbox" id="paymentDisclaimer">
            I understand that access is subject to successful realisation and
            verification of the payment. In case of a failed, reversed, disputed,
            or otherwise invalid payment, access may be suspended or revoked.
        </label>
        <input id="txnId"  placeholder="Enter last 6 alpha-numeric characters of Payment Transaction ID" type="text" value="" style="width:95%;padding:8px;font-size:16px;"/>
        <button id="verifyBtn" style="width:100%;padding:16px;margin-top:12px;font-size:16px;" onclick="verifyPayment()">Complete Payment</button>
    
    `;

    // insert START record to the database. this is user's intent to start payment
    const currentToken = await getMyAccessToken(false);
    const paymentStartResponse = await fetch('/pay/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key' : currentToken,
            'Authorization': 'Bearer ' + currentToken
        },
        body: JSON.stringify({
            amount: amount,
            currency: currency,
            payment_method: 'UPI',
            app_transaction_id: appTxnId,
            app_transaction_status: 'START'
        })
    });

    if (paymentStartResponse.ok){
        console.log('payment started ok !');
        const data = await paymentStartResponse.json();
        console.log('Payment start response', data);
    } else {
        console.error('Failed to add start payment record !');
    }

    return;
}

async function copyUPI(){
    await navigator.clipboard.writeText(getPaymentId());
    showNote("UPI ID copied", 3000);
}

async function verifyPayment(){
    console.log('verify payment invoked');
    const txnInput = document.getElementById("txnId");
    const verifyBtn = document.getElementById("verifyBtn");

    if (txnInput.value.trim().length !== 6) {
        showNote("Please enter last 6 alpha-numeric characters of the Payment Transaction ID.", 5000);
        document.getElementById("txnId").focus();
        return;
    }

    const chkFlag = document.getElementById("paymentDisclaimer");
    if (!chkFlag || chkFlag.checked !== true){
        showNote("Please read and select the clause.", 5000);
        if (chkFlag) chkFlag.focus();
        return;
    }

    console.log('Transaction ID entered: ' + txnInput.value);
    showNote("Verifying payment...and redirect to Onboarding", 5000 );

    // update last 6 alpha numeric value in the table
    const currentToken = await getMyAccessToken(false);
    const paymentResponse = await fetch('/pay/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key' : currentToken,
            'Authorization': 'Bearer ' + currentToken
        },
        body: JSON.stringify({
            paymentTxnId: txnInput.value.trim(),
            amount: amount,
            currency: currency,            
            appTransactionId: appTxnId
        })
    });

    if (paymentResponse.ok){
        console.log('payment started ok !');
        const data = await paymentResponse.json();
        console.log('Payment complete response ', data);
    } else {
        console.error('Failed to update payment complete record ! ' + appTxnId);
    }

    loadCoursePart('1a', 'usage-policy');
    return;
}

async function sendFailureAlert(innerHTML, participantEmail, data, currentToken){
    const payload = {
        to: 'contact@makelabs.in',
        content: 'C8 Labs environment - GKE Cluster.<br/><br/>'
                    + '<p>' + innerHTML + '</p>'
                    + '<p>'
                    + `<br/><br/>CF API status and message<br/>${data?.status} ${data?.message}`
                    + `<br/><br/>Application Transaction ID<br/>${appTxnId}`
                    + `<br/><br/>Participant Email<br/>${participantEmail}` 
                    + '</p>',
        subject: `Onboarding Failure - C8 Learning and Enablement - ${appTxnId}`
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
            if (opResponse.ok) showNote('Sending payment verification failure alert email...Done!');
        });
    return;
}

async function sendBankInfo(appTxnId, participantEmail, currentToken){
    const payload = {
        to: participantEmail,
        content: 'C8 Labs environment - GKE Cluster.<br/><br/>'
                    + `
Thank you for enrolling. Below is your reference number.<br/><br/>
App Transaction ID
${appTxnId}
<br/><br/>
`
                    + '<p><b>' + 'Bank Transfer Details' + '</b></p>'
                    + '<p>'
                    + `<br/><br/>
Country: USA 
Currency: USD ($)
Account Type: Business Checking

Bank Name: JPMORGAN CHASE BANK, N.A
Bank Address: JPMORGAN CHASE BANK, N.A., 383 MADISON AVENUE, NEW YORK - 10179, United States

Fedwire:
Account Number: 20000045068188
ABA Code: 021000021

ACH Credit:
Account Number: 20000045068188
ABA Code / Routing Number: 028000024

RTP:
Account Number: 20000045068188
Routing Number: 028000024

SWIFT:
Account Number: 20000045068188
BIC: CHASUS33XXX
`
                    + `<br/><br/>
Please make a payment to this bank account and proceed with next steps on the web portal.
` 
                    + '</p>',
        subject: `Onboarding - USD Bank Transfer - C8 Learning and Enablement - ${appTxnId}`
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
            if (opResponse.ok) showNote('Sending payment verification failure alert email...Done!');
        });
    return;
}

async function refreshPaymentSummaryForCurrency(nextCurrency) {
    const target = document.getElementById('payment-start');
    if (!target) return;

    await setPaymentCurrency(nextCurrency);
    target.innerHTML = await fetchPaymentTemplate(
        getPaymentId(),
        getPaymentRemarks(),
        getPaymentAmount(currency),
        getPaymentTxnId(),
        currency
    );
}

async function showPaymentSummary(defaultCurrency = 'INR') {
    const paymentRoot = document.getElementById('payment-template-root');
    if (!paymentRoot) { console.error('payment-template-root not found!'); return; }

    const selectedRadio = document.querySelector('input[name="paymentCurrency"]:checked');
    const selectedCurrency = defaultCurrency || (selectedRadio ? selectedRadio.value : 'INR');
    await setPaymentCurrency(selectedCurrency);
    paymentRoot.style.display = 'none';

    const element = document.getElementById('payment-start');
    if (!element) return;

    showNote('Please complete the payment to start with onboarding.', 10000);

    const upiIdValue = getPaymentId();
    const upiRemarks = getPaymentRemarks();
    const appTxnIdValue = getPaymentTxnId();
    const upiAmount = getPaymentAmount(currency);

    element.innerHTML = await fetchPaymentTemplate(
        upiIdValue,
        upiRemarks,
        upiAmount,
        appTxnIdValue,
        currency
    );

    if (!element.dataset.currencyBinderAttached) {
        element.addEventListener('change', async (event) => {
            const selected = event.target && event.target.matches && event.target.matches('input[name="paymentCurrency"]');
            if (!selected) return;

            const nextCurrency = event.target.value;
            await refreshPaymentSummaryForCurrency(nextCurrency);
        });
        element.dataset.currencyBinderAttached = 'true';
    }
}

window.showPaymentSummary = showPaymentSummary;

async function fetchPaymentTemplate(upiId, upiRemarks, upiAmount, appTxnId, selectedCurrencyCode = 'INR') {
    const defaultCurrency = selectedCurrencyCode === 'USD' ? 'USD' : 'INR';
    const currencySymbol = defaultCurrency === 'INR' ? '₹' : '$';
    const amountOriginal = getPaymentAmountOriginal(defaultCurrency);
    const paymentTitle = defaultCurrency === 'INR' ? 'Pay using UPI' : 'Pay via Bank Transfer';
    const paymentDescription = defaultCurrency === 'INR'
        ? 'Scan with PhonePe, Google Pay, Paytm or any UPI app'
        : 'Payment instructions sent to your email.<br/><br/><br/><code>Check your inbox for the USD bank transfer details.</code>';


    return `
<style>
.card{
max-width:680px;
margin:auto;
background:white;
padding:48px;
border-radius:12px;
box-shadow:0 4px 16px rgba(0,0,0,.08);
text-align:center;
justify-content: center;
}

.payment-currency-row {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin: 0 auto 18px;
    font-size: 0.9rem;
}

.paybutton{
width:45%;
padding:16px;
margin-top:12px;
font-size:16px;
cursor:pointer;
}

#qrContainer{
    display:none;
    margin:25px 25px;
    align-items: center;
    justify-content: center;
    gap: 42px;
}

.qr-step {
    text-align: center;
    justify-content: center;
    max-width:280px;
}

.qr-title {
    min-height: 48px;
    margin-bottom: 12px;
    line-height: 1.4;
    align-items: center;
    font-size: small;
}

.payment-instructions {
    min-height: 48px;
    margin-bottom: 12px;
    line-height: 1.4;
    text-align: left;
    font-size: small;
}

.qr-next {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 45px;
    font-weight: 600;
    white-space: nowrap;
    font-size: 0.90rem;
    color: #e8491d;
}

.qr-next span:last-child {
    font-size: 22px;
}

#qrUPI #qrUPIContainer #qrWhatsApp #qrWhatsAppContainer {
    display:flex;
    justify-content:center;
    align-items: center;
}

.footnote{
font-size:13px;
color:#777;
margin-top:20px;
}

.payment-sub-heading{
color: gray;
font-size: 0.8rem;
}

.payment-currency-option{
font-size: 0.8rem;
}

.payment-transfer-box {
    margin-top: 10px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fafafa;
    text-align: left;
    font-size: 0.8rem;
    line-height: 1.8;
}
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

<div class="card">
    <h2>Transaction Summary</h2>

    <div class="payment-currency-row">
        <label class="payment-currency-option"><input type="radio" name="paymentCurrency" value="INR" ${defaultCurrency === 'INR' ? 'checked' : ''} /> INR</label>
        <label class="payment-currency-option"><input type="radio" name="paymentCurrency" value="USD" ${defaultCurrency === 'USD' ? 'checked' : ''} /> USD</label>
    </div>

    <h1>${currencySymbol} <del>${amountOriginal}</del> ${upiAmount}</h1>

    <p>
        <span class="payment-sub-heading">App Transaction Id</span>
        <br/>
        ${appTxnId}
    </p>

    <p>
        <span class="payment-sub-heading">Remarks</span>
        <br/>
        ${upiRemarks}
    </p>

    <p>
    <span class="payment-sub-heading">
        ${defaultCurrency === 'INR' 
            ? 'Transfer amount to VPA'
            : 'Transfer method' }
    </span>
    <br/>
        ${defaultCurrency === 'INR' 
            ? `${upiId}` 
            : 'Bank Transfer'}
    </p>

    <button id="showQR" class="paybutton" onclick="showQR()">
        Show QR Code
    </button>

    <div id="qrContainer">

        <div id="qrUPIContainer" class="qr-step" hidden=true>
            <div class="qr-title">
                ${paymentTitle}
                <br/>
                <span style="color: grey">
                    ${paymentDescription}
                </span>
            </div>

            <div id="qrUPI"></div>
        </div>

        <div class="qr-next">
            <span>Next</span>
            <span>→</span>
        </div>

        <div id="qrWhatsAppContainer" class="qr-step" hidden=true>
            <div class="qr-title">
                Send payment receipt
                <br/>
                <span style="color: grey">Scan to send the payment receipt to Arica WhatsApp</span>
            </div>
            <div id="qrWhatsApp"></div>
        </div>
    </div>


    <div id="qrContainer-txn-id" class="payment-instructions"></div>

    <div class="footnote">
        Powered by Arica
    </div>
</div>
`;
}

window.showPaymentSummary = showPaymentSummary;
window.fetchPaymentTemplate = fetchPaymentTemplate;