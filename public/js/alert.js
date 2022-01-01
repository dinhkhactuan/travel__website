
export const hidenAlert = () => {
    const element = document.querySelector('.alert');
    if (element) element.parentElement.removeChild(element);
}

export const showAlert = (type, mess) => {
    hidenAlert()
    const makup = `<div class="alert alert--${type}">${mess}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', makup)
    window.setTimeout(hidenAlert, 2000)
}