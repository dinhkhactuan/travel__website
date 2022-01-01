import '@babel/polyfill'
import { dislayMapBox } from './mapbox'
import { login, logout } from './login'
import { updateEmailAndName } from './updateEmailAndName'
import { updatPassword } from './updatePassword'
import { booking } from './stripe'

const map = document.getElementById('map');
const logouts = document.querySelector('.nav__el--logout');
const formUpdate = document.querySelector('.form-user-data')
const btnsavepassword = document.querySelector('.form-user-password')
const bookTour = document.querySelector('#book-tour')
if (map) {
    const locations = JSON.parse(map.dataset.locations)
    console.log(locations)
    dislayMapBox(locations)
}
if (bookTour) {
    bookTour.addEventListener('click', (e) => {
        bookTour.textContent = 'updating ...'
        const tourId = e.target.dataset.tourId
        booking(tourId)
    })
}
if (formUpdate) {
    formUpdate.addEventListener('submit', (e) => {
        e.preventDefault()
        const form = new FormData()
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])

        updateEmailAndName(form)
    })
}
const form = document.querySelector('.form')
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email, password)
    })
}
if (logouts) {
    logouts.addEventListener('click', logout)
}
if (btnsavepassword) {
    btnsavepassword.addEventListener('submit', async (e) => {
        e.preventDefault()
        const password = document.querySelector('#password-current').value
        const newpassword = document.querySelector('#password').value
        const passwordconfirm = document.querySelector('#password-confirm').value
        const btnsavepassword = document.querySelector('.btn--save-password')
        btnsavepassword.textContent = 'Update Password....'
        await updatPassword({ password, newpassword, passwordconfirm })
        btnsavepassword.textContent = 'Save password'
    })
}
