const amount = 99;
const appTxnId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const upiId="makelabs%40sbi";
const upi = "upi://pay?" 
                + `pa=${upiId}&cu=INR`
                + `&am=${amount}`
                + "&tn=Payment+for+C8+Kubernetes+Labs+on+GCP"
                + `&tr=${appTxnId}`;


function showQR() {
    document.getElementById("qrContainer").style.display="block";
    document.getElementById("qr").innerHTML="";

    new QRCode(
        document.getElementById("qr"),
        {
        text:upi,
        width:240,
        height:240
        } );

    document.getElementById("qrContainer-txn-id").innerHTML=`
    <p>
        After completing the payment, please <code>enter last 6 alpha-numeric characters of Transaction ID from UPI app here</code> and click on "Complete Payment" to proceed to Onboarding.
        <br/><br/>
        <input id="txnId"  placeholder="Enter last 6 alpha-numeric characters of UPI Transaction ID" type="text" value="" style="width:95%;padding:8px;font-size:16px;"/>
        <button id="verifyBtn" style="width:100%;padding:16px;margin-top:12px;font-size:16px;" onclick="verifyPayment()">Complete Payment</button>
    </p>
    `;
}

async function copyUPI(){
    await navigator.clipboard.writeText(upiId);
    showNote("UPI ID copied", 3000);
}

async function verifyPayment(){
    console.log('verify payment invoked');
    const txnInput = document.getElementById("txnId");
    const verifyBtn = document.getElementById("verifyBtn");


    if (txnInput.value.trim().length === 0) {
        showNote("Please enter a valid transaction ID.", 5000);
        return;
    }

    if (txnInput.value.trim().length !== 6) {
        showNote("Please enter last 6 alpha-numeric characters of the transaction ID.", 5000);
        return;
    }

    console.log('Transaction ID entered: ' + txnInput.value);
    showNote("Verifying payment...and redirect to Onboarding", 3000 );
    loadCoursePart('1a', 'usage-policy');

}
