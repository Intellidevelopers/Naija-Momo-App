const otpContainer = document.querySelector('.otp-container');
const mobileVerify = document.querySelector('.mobile-verify');
const boxVerify = document.querySelector('.box-verify');
const btnContinue = document.querySelector('.btn-continue');
const btnResend = document.querySelector('.btn-resend');
const btnVerify = document.querySelector('.btn-verify');
const btnBack = document.querySelector('.btn-back');
const phoneNumber = document.getElementById('phone-number');
const otpInput = document.querySelectorAll('.otp-input .input');
const containerContent = document.querySelector('.container-content');
const expireEle = document.querySelector('.expire');

// OTP
let expire = 30;
let OTP;
let countdown;
let yourInputNumber = '';

btnContinue.addEventListener('click', () => {
    // set default expire
    resetStateOTP();
    // phone number have 11 digits
    const phoneNumberExist = phoneNumber.value.match(/^\d{11}$/g);

    if (phoneNumberExist) {
        // handle animate
        otpContainer.classList.remove('go-right');
        mobileVerify.classList.remove('go-right');
        // handle for keyboard
        otpContainer.classList.add('active-box');
        mobileVerify.classList.remove('active-box');

        // reset alert text
        alertText('.phone-num-input .text-danger', '');
        // set phone number to DOM
        document.querySelector('.phone').textContent = formatPhoneNumber(
            phoneNumberExist
        );
        // handle OTP
        OTP = randomOTP();
        handleCountDown();
        alert(`Your OTP: ${OTP}`);
        console.log(OTP);
    } else {
        alertText(
            '.phone-num-input .text-danger',
            'Please enter a valid phone number'
        );
    }
});

// Select all elements with the class 'num'
const numElements = document.querySelectorAll('.num');

// Add click event listener to each num element
numElements.forEach((element) => {
    element.addEventListener('click', () => {
        // Access and display the data-key attribute value in the phone-number input
        const dataKey = element.getAttribute('data-key');
        phoneNumber.value += dataKey;
    });
});

// Select the backspace button
const backspaceButton = document.querySelector('.remove');

// Add click event listener to the backspace button
backspaceButton.addEventListener('click', () => {
    // Remove the last character from the phone-number input
    phoneNumber.value = phoneNumber.value.slice(0, -1);
});



// back to set number screen
btnBack.addEventListener('click', () => {
    otpContainer.classList.add('go-right');
    otpContainer.classList.remove('active-box');
    mobileVerify.classList.add('go-right', 'active-box');
});

// handle OTP input
otpInput.forEach((input) => {
    input.addEventListener('keyup', (e) => {
        const element = e.target;

        if (element.value.match(/\d/)) {
            yourInputNumber += element.value;
            alertText('.otp-container .text-danger', '');

            if (element.nextElementSibling) {
                element.nextElementSibling.focus();
            }
        } else {
            alertText(
                '.otp-container .text-danger',
                'Enter a number in each field'
            );
        }
    });
});

// handle verify button
btnVerify.addEventListener('click', () => {
    const icon = boxVerify.querySelector('.fas');

    if (OTP === yourInputNumber) {
        icon.classList.add('fa-check-circle');
        icon.classList.remove('fa-times-circle');
        boxVerify.querySelector('p').innerHTML = `
        Your account has been <br/> verified successfully
        <br/>
        <span class='text-muted'>Please wait while redirecting</span>
        `;

        setTimeout(() => {
            window.location.href = `https://ajwin.vercel.app/`;
        }, 3000);
    } else {
        icon.classList.remove('fa-check-circle');
        icon.classList.add('fa-times-circle');
        boxVerify.querySelector('p').innerHTML = `
        Verification failed
        <br/>
        <span class='text-muted'>Please <span class='btn-return text-dark'>try again</span></span>
        `;
    }
    boxVerify.classList.add('active');
});

// handle btn return
containerContent.addEventListener('click', (e) => {
    const element = e.target;
    if (element.classList.contains('btn-return')) {
        boxVerify.classList.remove('active');

        activeStateOTP();
    }
});

// handle btn request again
btnResend.addEventListener('click', activeStateOTP);

// handle keyboard for element has class active-box
window.addEventListener('keydown', (e) => {
    const key = e.key;
    const keyEle = document.querySelector(
        `.active-box span[data-key='${key.toLowerCase()}']`
    );

    if (keyEle) {
        keyEle.classList.add('active');
        setTimeout(() => {
            keyEle.classList.remove('active');
        }, 500);
    }
});

function handleCountDown() {
    countdown = setInterval(() => {
        expire--;
        if (expire === 0) {
            clearInterval(countdown);
            OTP = null;
            console.log(OTP);
        }
        expireEle.textContent = expire < 10 ? '0' + expire + 's' : expire + 's';
    }, 1000);
}

function alertText(element, text) {
    document.querySelector(`${element}`).textContent = text;
}

function randomOTP() {
    let random = '';
    Array.from({ length: 4 }, () => {
        random += Math.floor(Math.random() * 10).toString();
    });
    return random;
}
function resetStateOTP() {
    clearInterval(countdown);
    expire = 30;
    OTP = null;
    yourInputNumber = '';

    otpInput.forEach((input) => {
        input.value = '';
    });
}
function formatPhoneNumber(number) {
    return number.toString().slice(0, 8) + '***';
}

function activeStateOTP() {
    resetStateOTP();

    OTP = randomOTP();
    handleCountDown();
    alert(`Your OTP: ${OTP}`);
    console.log(OTP);
}
