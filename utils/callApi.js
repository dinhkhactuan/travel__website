const { model } = require("mongoose");


class callApi {
    constructor(data, queryString) {
        this.data = data;
        this.queryString = queryString;
    }
    //lọc
    fillter() {
        const queryobject = { ...this.queryString };
        const filed = ['page', 'sort', 'limit', 'fields'];
        filed.forEach(fields => delete queryobject[fields])
        // lớn hơn,lớn hơn hoặc bằng ,nhỏ hởn, nhỏ hơn hoặc băng
        let queryString = JSON.stringify(queryobject)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.data = this.data.find(JSON.parse(queryString));
        return this
    }
    // >= > < <=
    sort() {
        if (this.queryString.sort) {
            const handle = this.queryString.sort.split(',').join(' ')
            this.data = this.data.sort(handle)
        } else {
            this.data = this.data.sort('-createdAt')
        }
        return this
    }
    //chọn lấy fields
    fields() {
        if (this.queryString.fields) {
            const check = this.queryString.fields.split(',').join(' ')
            this.data.select(check)
        } else {
            this.data = this.data.select('-__v')
        }
        return this
    }
    phantrang() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.data = this.data.skip(skip).limit(limit)
        return this
    }
}
module.exports = callApi;