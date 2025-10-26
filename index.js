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

function backupOTPs(){
    const date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate();
    let ymd = `${year}${month}${day}`;
    const blob = new Blob([localStorage.getItem("saved").substring(1)], {type: "text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = ymd + "-" + date.getTime() + "-WebOTP.webotpsave";
    link.click();
    URL.revokeObjectURL(link.href);
}

function restoreOTPs(){
    let fr = new FileReader();
    fr.onload = function (){
        localStorage.setItem("saved", localStorage.getItem("saved") + "\n" + fr.result);
        window.location.reload();
    };
    fr.readAsText(document.getElementById("restore").files[0]);
}

window.onload = function (){
    if (this.localStorage.getItem("saved") == null){
        this.localStorage.setItem("saved", "");
    }
    const formData = new FormData();
    let storage = this.localStorage.getItem("saved");
    let structured_storage = storage.split("\n");
    structured_storage.shift();
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
            for (let count = 0; count < response.split("<br>").length; count++){
                if (response.split("<br>")[count] != ""){
                    let h1 = document.createElement('h1');
                    h1.innerHTML = response.split("<br>")[count];
                    let a = document.createElement("a");
                    a.style.display = "flex";
                    a.style.alignItems = "center";
                    a.style.justifyContent = "center";
                    a.style.height = "36px";
                    a.style.width = "36px";
                    a.addEventListener("click", function (){
                        structured_storage.splice(count, 1);
                        let new_structured_storage = "";
                        structured_storage.forEach(newItem => {
                            new_structured_storage += "\n" + newItem;
                        });
                        localStorage.setItem("saved", new_structured_storage);
                        window.location.reload();
                    });
                    let img = document.createElement("img");
                    img.style.height = "24px";
                    img.style.width = "24px";
                    img.src = "delete_icon.png";
                    let div = document.createElement("div");
                    div.style.display = "flex";
                    div.style.alignItems = "center";
                    div.style.gap = "8px";
                    div.appendChild(h1);
                    a.appendChild(img);
                    div.appendChild(a);
                    document.getElementById('otp-container').appendChild(div);
                }
            }
        }
    };
    requestPost.send(formData);
};
