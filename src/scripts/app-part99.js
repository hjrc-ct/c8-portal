const upi="upi://pay?pa=makelabs%40sbi&cu=INR&pn=RAGHAVENDRA+CHARI+HOTHUR+JOSHI&am=99&tn=Payment+for+C8+Kubernetes+Labs+on+GCP+&tr=32019614719090712678ec05fdd20e416dc4a3f7f7d6d407f88151eb0948f603";
const upiId="makelabs@sbi";

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
        After completing the payment, please <code>copy-paste the Transaction ID from UPI app here</code> and click on "Verify Payment" button.
        <br/><br/>
        <input id="txnId"  placeholder="Enter UPI Transaction ID" type="text" value="" style="width:95%;padding:8px;font-size:16px;"/>
        <button id="verifyBtn" style="width:100%;padding:16px;margin-top:12px;font-size:16px;" onclick="verifyPayment()">Verify Payment</button>
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
        showNote("Please enter a valid transaction ID.", 3000);
        return;
    }

    console.log('Transaction ID entered: ' + txnInput.value);
    showNote("Verifying payment...and redirect to Onboarding", 3000 );
    loadCoursePart('1a', 'usage-policy');

}
