const Card = require('../models/card');

const { OK_STATUS } = require('../utils/constants');
const { CREATED_STATUS } = require('../utils/constants');
const { BAD_REQ_STATUS } = require('../utils/constants');
const { NOT_FOUND_PAGE_STATUS } = require('../utils/constants');
const { SERVER_ERROR_STATUS } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_STATUS).send(cards))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({
      message: 'Ошибка, статус ответа сервера: 500',
    }));
};

module.exports.createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_STATUS).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ_STATUS).send({
          message:
            'При создании карточки были введены некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS).send({
          message: 'Ошибка, статус ответа сервера: 500',
        });
      }
    });
};

module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK_STATUS).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS)
          .send({ message: 'Карточка c данным Id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQ_STATUS).send({
          message: 'При попытке поставить лайк переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS).send({
        message: 'Ошибка, статус ответа сервера: 500',
      });
    });
};

module.exports.removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK_STATUS).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS)
          .send({ message: 'Карточка c данным Id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQ_STATUS).send({
          message:
            'При попытке снять лайк переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS).send({
        message: 'Ошибка, статус ответа сервера: 500',
      });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_PAGE_STATUS)
          .send({ message: 'Карточка c данным Id не найдена' });
      }
      return res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ_STATUS).send({
          message: 'При попытке удалить карточку переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS).send({
          message: 'Ошибка, статус ответа сервера: 500',
        });
      }
    });
};
