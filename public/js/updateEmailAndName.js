import axios from 'axios'
import { showAlert } from './alert'
export const updateEmailAndName = async (data) => {
    try {
        const newData = await axios({
            method: 'PATCH',
            url: '/users/updateFiels',
            data
        })
        console.log(newData)
        if (newData.data.status == 'thanh cong') {
            showAlert('success', 'update success')
        }
    } catch (err) {
        showAlert('error', 'updatefailed')
    }
}