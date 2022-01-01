import axios from 'axios'
import { showAlert } from './alert'

export async function login(email, password) {
    try {
        const res = await axios({
            method: 'POST',
            url: '/users/login',
            data: {
                email,
                password
            }
        })
        if (res.data.status === 'success') {
            showAlert('success', 'đăng nhập thành công')
            window.setTimeout(() => {
                location.assign('/')
            }, 2000)
        }
    } catch (err) {
        showAlert('error', 'đăng nhập thất bại')
    }
}
export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/users/logout',
        })
        console.log(res)
        if ((res.data.status == 'success')) {
            location.reload(true)
        }
    } catch (err) {
        console.log(err)
        showAlert('error', 'logut failed')
    }
}



