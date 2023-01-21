document.addEventListener("click", (e) => {
    const {target} = e;
    if (!target.matches("nav a")) {
        return;
    }
    e.preventDefault();
    urlRoute();
})

const urlRouters = {
    404: {
        template: "/pages/404.html",
        title: "",
        description: "",
    },
    "/": {
        template: "/pages/index.html",
        title:"",
        description:""
    },
    "/products": {
        template: "/pages/products.html",
        title: "",
        description: "",
    },
    "/addProduct": {
        template: "/pages/addProduct.html",
        title: "",
        description: "",
    },
    "/index.html": {
        template: "/pages/index.html",
        title: "",
        description:""
    }
}

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
}

const urlLocationHandler = async() => {
    const path = window.location.pathname;
    console.log(path);
    if (path.length == 0) {
        path = "/"
    }

    const route = urlRouters[path] || urlRouters[404];
    const html = await fetch(route.template).then(res => res.text())
    document.getElementById("spa").innerHTML = html;
}

window.onpopstate = urlLocationHandler;

window.route = urlRoute

urlLocationHandler()
