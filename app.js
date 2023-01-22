// regular expression for validation
const strRegex = /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

// -------------------------------------------------- //

const countryList = document.getElementById('country-list');
const fullscreenDiv = document.getElementById('fullscreen-div');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const modalBtns = document.getElementById('modal-btns');
const form = document.getElementById('modal');
const addrBookList = document.querySelector('#addr-book-list tbody');

// -------------------------------------------------- //
let addrName = firstName = lastName = email = phone = streetAddr = postCode = city = country = labels = "";

class Address {
    constructor(id, addrName, firstName, lastName, email, phone, streetAddr, postCode, city, country, labels) {
        this.id = id;
        this.addrName = addrName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.streetAddr = streetAddr;
        this.postCode = postCode;
        this.city = city;
        this.country = country;
        this.labels = labels;
    }

    static getAddresses() {
        let addresses;
        if (localStorage.getItem("addresses") == null) {
            addresses = []
        } else {
            addresses = JSON.parse(localStorage.getItem("addresses"));
        }
        return addresses;
    }

    static addAddress(address) {
        const addresses = Address.getAddresses();
        addresses.push(address);
        localStorage.setItem("addresses", JSON.stringify(addresses));
    }
}

class UI {
    static showModal() {
        modal.style.display = "block";
        fullscreenDiv.style.display = "none"
    }
    static closeModal() {
        modal.style.display = "none";
        fullscreenDiv.style.display = "none"
    }

    static showAllAddresses() {
        const addresses = Address.getAddresses();
        addresses.forEach(address => UI.addToAddressList(address))
    }

    static addToAddressList(address) {
        const tr = document.createElement("tr");
        tr.setAttribute("date-id", address.id);
        tr.innerHTML = `
                <td>${address.id}</td>
                <td>
                <span class = "addressing-name">${address.addrName}</span><br><span class = "address">${address.streetAddr} ${address.postCode} ${address.city} ${address.country}</span>
                </td>
                <td><span>${address.labels}</span></td>
                <td>${address.firstName + " " + address.lastName}</td>
                <td>${address.phone}</td>
        `
        addrBookList.appendChild(tr);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadJSON();
    eventListeners();
    UI.showAllAddresses();
    // console.log(Address.getAddresses())
})

// hodisalarni eshitib turuvchi
function eventListeners() {
    addBtn.addEventListener("click", () => {
        // form.reset();
        document.getElementById("modal-title").innerHTML = "Add Address";
        UI.showModal();
        document.getElementById("modal-btns").innerHTML = `
            <button type="submit" id="save-btn"> Save </button>
        `
    })

    // close modal
    closeBtn.addEventListener("click", UI.closeModal)

    // add
    modalBtns.addEventListener("click", (e) => {
        e.preventDefault();

        if (e.target.id == "save-btn") {
            let isFormValidate = getFormData()
            if (!isFormValidate) {
                form.querySelectorAll("input").forEach(input => {
                    setTimeout(() => {
                        input.classList.remove("errorMsg");
                    }, 1500)
                })
            } else {
                let allItems = Address.getAddresses();
                let lastItemId = (allItems.length > 0) ? allItems[allItems.length - 1].id : 0;
                lastItemId++

                console.log(lastItemId);

                const addressItem = new Address(lastItemId, addrName, firstName, lastName, email, phone, streetAddr, postCode, city, country, labels);
                Address.addAddress(addressItem)
                UI.closeModal();
                // UI.showAllAddresses();
                form.reset();
            }
        }
    })
}


function loadJSON() {
    fetch("country.json")
        .then(res => res.json())
        .then(data => {
            let html = "";
            data.forEach(country => {
                html += `
            <option>${country.name}</option>`
            })
            countryList.innerHTML = html
        })
}

// get form data
function getFormData() {
    let inputValidation = [];

    // console.log(form.addr_ing_name.value, form.first_name.value, form.last_name.value, form.email.value, form.phone.value, form.street_addr.value, form.postal_code.value, form.city.value, form.country.value, form.labels.value);

    if (!strRegex.test(form.addr_ing_name.value) || form.addr_ing_name.value.trim().length == 0) {
        addErrMsg(form.addr_ing_name);
        inputValidation[0] = false
    } else {
        addrName = form.addr_ing_name.value;
        inputValidation[0] = true
    }

    if (!strRegex.test(form.first_name.value) || form.first_name.value.trim().length == 0) {
        addErrMsg(form.first_name);
        inputValidation[1] = false
    } else {
        firstName = form.first_name.value;
        inputValidation[1] = true
    }

    if (!strRegex.test(form.last_name.value) || form.last_name.value.trim().length == 0) {
        addErrMsg(form.last_name);
        inputValidation[2] = false
    } else {
        lastName = form.last_name.value;
        inputValidation[2] = true
    }

    if (!emailRegex.test(form.email.value)) {
        addErrMsg(form.email);
        inputValidation[3] = false
    } else {
        email = form.email.value;
        inputValidation[3] = true
    }

    if (!phoneRegex.test(form.phone.value)) {
        addErrMsg(form.phone);
        inputValidation[4] = false
    } else {
        phone = form.phone.value;
        inputValidation[4] = true
    }

    if (!strRegex.test(form.street_addr.value) || form.street_addr.value.trim().length == 0) {
        addErrMsg(form.street_addr);
        inputValidation[5] = false
    } else {
        streetAddr = form.street_addr.value;
        inputValidation[5] = true
    }

    if (!digitRegex.test(form.postal_code.value)) {
        addErrMsg(form.postal_code);
        inputValidation[6] = false
    } else {
        postCode = form.postal_code.value;
        inputValidation[6] = true
    }

    if (!strRegex.test(form.city.value) || form.city.value.trim().length == 0) {
        addErrMsg(form.city);
        inputValidation[7] = false
    } else {
        city = form.city.value;
        inputValidation[7] = true
    }

    country = form.country.value;
    labels = form.country.value;

    return inputValidation.includes(false) ? false : true
}

function addErrMsg(inputBox) {
    inputBox.classList.add("errorMsg");
}