import Tapotan from "./core/Tapotan";

window.onload = () => {
    Tapotan.instance = new Tapotan();
    Tapotan.instance.init();
};
