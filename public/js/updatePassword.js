import axios from "axios"
import { showAlert } from './alert'

export const updatPassword = async (data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/users/updatepassword',
            data
        })
        if (res.data.status == 'thanh cong') {
            showAlert('success', 'updatepassword success')
        }
    } catch (err) {
        console.log(err)
        showAlert('error', 'updatepassword failed')
    }
}