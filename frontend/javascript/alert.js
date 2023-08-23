function showAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'block';
}

function closeAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'none';
}

document.addEventListener("click", (evt) => {
    const customAlert = document.getElementById("customAlert");
    let targetEl = evt.target;
    if (targetEl != customAlert) {
        // closeAlert();
    }
});