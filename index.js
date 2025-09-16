let timer = setTimeout(function (){
    window.location.reload();
}, 30000);

function chooseQR(input){
    const label = document.querySelector("label[for='file']");
    if (input.files && input.files.length > 0) {
        label.textContent = input.files[0].name;
    } else {
        label.textContent = "Choose QR Code";
    }
}

function uploadQR(){
    clearTimeout(timer);
    const formData = new FormData();
    formData.append('file', document.getElementById("file").files[0]);
    let requestPost = new XMLHttpRequest();
    requestPost.open("POST", "https://isaiahnoelsubaccount.pythonanywhere.com/web_otp_scan", true);
    requestPost.onreadystatechange = function (){
        if (requestPost.status == 200 && requestPost.readyState == 4){
            localStorage.setItem("saved", localStorage.getItem("saved") + "\n" + requestPost.responseText);
            window.location.reload();
        }
    };
    requestPost.send(formData);
}

function clearOTPs(){
    localStorage.setItem("saved", "");
    window.location.reload();
}

function refreshOTPs(){
    window.location.reload();
}

window.onload = function (){
    if (this.localStorage.getItem("saved") == null){
        this.localStorage.setItem("saved", "");
    }
    const formData = new FormData();
    let storage = this.localStorage.getItem("saved");
    let structured_storage = storage.split("\n");
    let formDataBody = "";
    structured_storage.forEach(item => {
        if (item != ""){
            let id = "";
            let account = "";
            let secret = "";
            let issuer = "";
            let query = item.split("?");
            id = query[0].split("totp")[1].toLowerCase().replaceAll("%20", " ");
            account = query[0].split(":")[query[0].split(":").length - 1].replaceAll("%20", " ");
            let queries = query[1].split("&");
            queries.forEach(queryItem => {
                if (queryItem.split("=")[0] == "secret"){
                    secret = queryItem.split("=")[1];
                }
                if (queryItem.split("=")[0] == "issuer"){
                    issuer = queryItem.split("=")[1];
                }
            });
            formDataBody += id.replace("/", "(slash)").replace(":", "(colon)") + "()" + account + "()" + secret + "()" + issuer + "(nl)";
        }
    });
    formData.append("otps", formDataBody);
    let requestPost = new XMLHttpRequest();
    requestPost.open("POST", `https://isaiahnoelsubaccount.pythonanywhere.com/web_otp?qrdata=${formDataBody}`, true);
    requestPost.onreadystatechange = function (){
        if (requestPost.status == 200 && requestPost.readyState == 4){
            let response = requestPost.responseText;
            let h1 = document.createElement('h1');
            h1.innerHTML = response;
            document.getElementById('otp-container').appendChild(h1);
        }
    };
    requestPost.send(formData);
};