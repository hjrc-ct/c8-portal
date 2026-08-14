const accessPlan = "Premium"; // selected access plan
const amount = 99;
const appTxnId = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
const upiId=encodeURIComponent("makelabs@sbi");
const remarks = 'Payment+for+C8+Kubernetes+Labs+on+GCP';
const upi = "upi://pay?" 
                + `pa=${upiId}&cu=INR`
                + `&am=${amount}`
                + `&tn=${remarks}`
                + `&tr=${appTxnId}`;

const whatsappNumber = "918217538171"; // arica whatsapp handler
const waInput = `c8k8s ${appTxnId}`;
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waInput)}`;


function getPaymentAmount()  { return amount.toLocaleString('en-IN');   }
function getPaymentTxnId()   { return decodeURIComponent(appTxnId); }
function getPaymentId()      { return decodeURIComponent(upiId);    }
function getPaymentRemarks() { return decodeURIComponent(remarks.replace(/\+/g, " "));  }

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

    new QRCode(
        document.getElementById("qrUPI"),
        {
        text:upi,
        width:240,
        height:240
        } );

    new QRCode(
        document.getElementById("qrWhatsApp"),
        {
        text:whatsappUrl,
        width:240,
        height:240
        } );    

    document.getElementById("qrContainer-txn-id").innerHTML=`
        <hr/>
        <b>Instructions - UPI App:</b><br/>
        (a) Scan <code>UPI QR</code> to make the payment.<br/>
        <br/>
        <b>Instructions - WhatsApp:</b><br/>
        (b) Next, scan WhatsApp QR code and <code>send the pre-configured message as-is</code> to the Arica number. Wait for acknowledgement - upto 10 seconds.<br/>
        (c) Send the <code>UPI payment receipt image</code> to the Arica number.<br/>
        (d) Click on <code>Generate PDF</code> button in WhatsApp to generate the payment receipt.<br/>
        (e) The backend may take upto a minute or so, but you may proceed.<br/>
        <br/>
        <b>Instructions - <code>Complete Payment</code></b><br/>
        (f) Enter the last 6 characters of your UPI Transaction Id and click <code>Complete Payment</code> to proceed to onboarding.
        <br/><br/>
        <input id="txnId"  placeholder="Enter last 6 alpha-numeric characters of UPI Transaction ID" type="text" value="" style="width:95%;padding:8px;font-size:16px;"/>
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
            currency: 'INR',
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
        showNote("Please enter last 6 alpha-numeric characters of the UPI Transaction ID.", 5000);
        document.getElementById("txnId").focus();
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
