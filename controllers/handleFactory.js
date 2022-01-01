const callApi = require('../utils/callApi')

exports.deleteOne = Model => async (req, res, next) => {
    try {
        const tour = await Model.findByIdAndDelete({ _id: req.params.id });
        res.status(203).json({
            message: 'successful',
            data: tour
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error
        })
    }
}

exports.updateOne = Model => async (req, res) => {
    try {
        const data = await Model.findByIdAndUpdate({ _id: req.params.id },
            req.body, {
            new: true,
            runValidators: true
        }
        )
        res.status(200).json({
            message: 'succseful',
            data
        })
    }
    catch (err) {
        res.status(500).json({
            mesage: 'loisever',
            err
        })
    }
}

exports.createOne = Model => async (req, res, next) => {

    try {
        const document = await Model.create(req.body)
        res.status(200).json({
            message: 'success',
            document
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'fail',
            status: err
        })
    }
}

exports.getOne = (Model, option) => async (req, res) => {
    try {
        let query = Model.findById({ _id: req.params.id })
        if (option) {
            query = query.populate(option)
        }
        const data = await query;
        res.json({
            message: 'succsetful',
            data
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'fail',
            data: err
        })
    }
}

exports.getAll = Model => async (req, res) => {

    try {

        let fillter = {};
        if (req.params.tourId) fillter = { tour: req.params.tourId }

        const doc = new callApi(Model.find(fillter), req.query)
            .fillter()
            .sort()
            .fields()
            .phantrang()
        const datas = await doc.data

        res.json({
            message: 'succesful',
            datas
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'loi sever',
            status: error
        })
    };
}