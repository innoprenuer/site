//=include bigchain/smoothscroll.js
//=include bigchain/newsletter.js

jQuery(function($) {

    //
    // init modules
    //
    Newsletter.init()
})

//=include bigchaindb-driver/dist/browser/bundle.window.min.js

window.addEventListener('DOMContentLoaded', function domload(event){
    window.removeEventListener('DOMContentLoaded', domload, false)

    const driver = window.BigchainDB
    const API_PATH = 'https://test.ipdb.io/api/v1/'
    const APP_ID = 'b563bf22'
    const APP_KEY = 'fd639614dcf8ee90a8c51a013ac11fb0'

    const form = document.getElementById('form-transaction')
    const postButton = document.getElementById('post')

    postButton.addEventListener('click', function(e) {
        e.preventDefault()

        const message = document.getElementById('message').value

        const alice = new driver.Ed25519Keypair()
        const tx = driver.Transaction.makeCreateTransaction(
            { assetMessage: message },
            [ driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(alice.publicKey))
            ],
            alice.publicKey
        )
        const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)

        const conn = new driver.Connection(API_PATH, {
            app_id: APP_ID,
            app_key: APP_KEY
        })

        conn.postTransaction(txSigned)
            .then(() => {
                const output = document.getElementById('output')
                const outputContent = conn.getStatus(txSigned.id)

                output.textContent = outputContent
            })
            .then((res) => console.log('Transaction status:', res.status))

    }, false)
}, false)
