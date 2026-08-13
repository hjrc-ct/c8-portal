CREATE TABLE IF NOT EXISTS payments (
    email TEXT NOT NULL,
    app_transaction_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT,
    app_transaction_status TEXT,
    payment_method TEXT,
    payment_transaction_id TEXT,
    payment_transaction_status TEXT,
    expiry_timestamp TEXT,
    payment_notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (email, app_transaction_id)
);

CREATE INDEX IF NOT EXISTS idx_payments_email
ON payments(email);

CREATE INDEX IF NOT EXISTS idx_payments_app_transaction_id
ON payments(app_transaction_id);


/*
    currency                     -> INR
    payment_method               -> UPI
    app_transaction_status       -> START or PAID or VERIFIED
    payment_transaction_status   -> START or PAID
    expiry_timestamp             -> 48 hours + when app_transaction_status=PAID
*/
