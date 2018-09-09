function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);

var config = {
    //authority: "https://login.microsoftonline.com/tfp/your-tenant.onmicrosoft.com/B2C_1_SPA_SUSI/v2.0/.well-known/openid-configuration",
    authority: "https://your-azure-tenant.blob.core.windows.net/azure-ad-b2c/.well-known/openid-configuration",
    client_id: "49f1a95f-b846-4f1d-a787-c8e52e533e49",
    redirect_uri: "http://localhost:20501/callback.html",
    response_type: "id_token token",
    scope: "openid https://your-tenant.onmicrosoft.com/demoapi/demo.read",
    post_logout_redirect_uri: "http://localhost:20501/index.html",
    automaticSilentRenew: true,
    filterProtocolClaims: false,
    loadUserInfo: false
};
var mgr = new Oidc.UserManager(config);

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
    }
    else {
        log("User not logged in");
    }
});


function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = "http://localhost:20501/api/values";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}