const router = require('express').Router();

const { NOT_FOUND_PAGE_STATUS } = require('../utils/constants');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('/*', (req, res) => {
  res
    .status(NOT_FOUND_PAGE_STATUS)
    .send({ message: `${NOT_FOUND_PAGE_STATUS}: Страница не найдена.` });
});

module.exports = router;
