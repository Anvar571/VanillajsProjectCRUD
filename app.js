
// -------------------------------------------------- //
// birinchi variablelarni olib kelib olamiz
const addBtn = document.getElementById("add-btn");
const fullscreenDiv = document.getElementById("fullscreen-div");
const form = document.getElementById("modal");
const modalBtns = document.getElementById("modal-btns");
const modal = document.querySelector(".modal");
const closeBtn = document.getElementById("close-btn");
const productView = document.getElementById("addr-book");
const searchInput = document.getElementById("search-input");
const productList = document.querySelector("tbody");


let inputSearch = '';
let proName = proPrice = proYear = proDesc = category = "";
let productArr = [];

class Product {
    constructor(productId, name, price, year, description) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.year = year;
        this.description = description;
        this.timeStamp = new Date().toString().slice(16, 24);
    }

    static getProducts() {
        if (localStorage.getItem("products") == null) {
            productArr = []
        } else {
            productArr = JSON.parse(localStorage.getItem("products"))
        }
    }

    static addProduct(product) {
        Product.getProducts();

        productArr.push(product)
        localStorage.setItem("products", JSON.stringify(productArr))
    }

    static update(item) {
        Product.getProducts()

        // const product = Product.getProducts();

        productArr.forEach(address => {
            if (address.id == item.id) {
                address.description = item.description;
                address.name = item.name;
                address.price = item.price;
                address.year = item.year;
                address.category = item.category;
            }
        });

        localStorage.setItem('products', JSON.stringify(productArr));
        UI.showAllProducts();

    }

    static productSort(){
        
    }

    static deleteAddress(id) {
        Product.getProducts();

        productArr.forEach((val, ind) => {
            if (val.productId == id) {
                productArr.splice(ind, 1)
            }
        });

        localStorage.setItem('products', JSON.stringify(productArr));
        UI.closeModal()
        form.reset();
        UI.showAllProducts();
    }
}

class UI {
    
    static showModal() {
        modal.style.display = "block";
        productView.style.display = "none"
    }

    static closeModal() {
        modal.style.display = "none";
        productView.style.display = "block"
    }

    static filterData(){
        Product.getProducts();
        
        if (inputSearch.length == 0){
            return productArr;
        }

        return productArr.filter(node => node.name.indexOf(inputSearch) > -1)
    }

    static showAllProducts() {
        productList.innerHTML = "";
        
        const arr = UI.filterData();

        arr.forEach(data => UI.genereateProduct(data))
    }

    static genereateProduct(productObj) {
        let { productId, name, price, year, description } = productObj;

        const tableRow = document.createElement('tr');

        tableRow.setAttribute('data-id', productId);
        tableRow.innerHTML = `
            <td>${productId}</td>
            <td>${name}</td>
            <td><span>${year}</span></td>
            <td>${price}</td>
            <td>${description}</td>
            <td>${new Date()}</td>
        `;

        productList.appendChild(tableRow);
    }

    static showModalData(id) {
        Product.getProducts()
        // const addresses = Product.getProducts();

        productArr.forEach(product => {
            if (product.productId == id) {
                form.product_dscr.value = product.description;
                form.product_name.value = product.name;
                form.product_price.value = product.price;
                form.product_year.value = product.year;

                document.getElementById('modal-title').innerHTML = "Change Address Details";

                document.getElementById('modal-btns').innerHTML = `
                    <button type = "submit" id = "update-btn" data-id = "${id}">Update </button>
                    <button type = "button" id = "delete-btn" data-id = "${id}">Delete </button>
                `;
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // js yuklanganda ichidagi functionlar ishlaydi
    eventHandler();
    UI.showAllProducts();
})

// varcha eventlar shu yerda bajariladi
function eventHandler() {
    // show modal
    addBtn.addEventListener("click", () => {
        UI.showModal()
        document.getElementById("modal-btns").innerHTML = `
            <button type = "submit" id = "save-btn"> Save </button>
        `
    })

    // close modal
    closeBtn.addEventListener("click", () => {
        UI.closeModal()
    })

    modalBtns.addEventListener("click", (e) => {
        e.preventDefault()

        if (e.target.id == "save-btn") {
            let isValidation = validationData();
            if (!isValidation) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                Product.getProducts();

                let productLength = (productArr.length > 0) ? productArr[productArr.length - 1].productId : 0;
                productLength++;

                const allItem = new Product(productLength, proName, proPrice, proYear, proDesc);
                Product.addProduct(allItem)
                UI.closeModal()
                UI.genereateProduct(allItem);
            }
        }
    })

    productList.addEventListener("click", (event) => {
        UI.showModal();
        let trElement;
        if (event.target.parentElement.tagName == "TD") {
            console.log("td");
            trElement = event.target.parentElement.parentElement;
        }

        if (event.target.parentElement.tagName == "TR") {
            trElement = event.target.parentElement;
        }

        let viewID = trElement.dataset.id;
        UI.showModalData(viewID)
    })

    modalBtns.addEventListener('click', (event) => {
        if (event.target.id == 'delete-btn') {
            Product.deleteAddress(event.target.dataset.id);
        }
    });

    modalBtns.addEventListener("click", (event) => {
        event.preventDefault();
        if (event.target.id == "update-btn") {
            let id = event.target.dataset.id;
            let isFormValid = validationData();
            if (!isFormValid) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                const addressItem = new Product(id, proName, proPrice, proYear, proDesc);
                Product.update(addressItem);
                UI.closeModal();
                form.reset();
            }
        }
    })
}

function fetchData() {
    fetch('country.json')
        .then(res => res.json())
        .then(data => {
            let html = "";
            data.forEach(country => {
                html += `
                <option>${country.year}</option>
            `
            })
            countryYear.innerHTML = html
        })
}

function validationData() {
    let allError = []

    if (form.product_year.value.length == 0) {
        addError(form.product_year);
        allError[0] = false;
    } else {
        proYear = form.product_year.value;
        allError[0] = true
    }

    if (form.product_price.value.trim().length == 0) {
        addError(form.product_price);
        allError[1] = false;
    } else {
        proPrice = form.product_price.value;
        allError[1] = true
    }

    if (form.product_name.value.length == 0) {
        addError(form.product_name);
    } else {
        proName = form.product_name.value
    }

    category = form.category.value;
    proDesc = form.product_dscr.value;

    return allError.includes(false) ? false : true;
}

function addError(inputError) {
    inputError.classList.add("errorMsg")
}

searchInput.addEventListener("input", (e) => {
    inputSearch = e.target.value;
    UI.showAllProducts();
})