const Card = require('../models/card');

const { CREATED_STATUS } = require('../utils/constants');

const AccessDeniedError = require('../errors/AccessDeniedError');
const InvalidDataError = require('../errors/InvalidDataError');
const NotFoundPageError = require('../errors/NotFoundPageError');

function getCards(_, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function createNewCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED_STATUS).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new InvalidDataError(
            'При добавлении новой карточки, переданы некорректные данные.',
          ),
        );
      } else {
        next(err);
      }
    });
}

function addLikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundPageError('Карточка с данным Id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'При попытке поставить лайк, переданы некорректные данные.',
          ),
        );
      } else {
        next(err);
      }
    });
}

function removeLikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundPageError('Карточка c пданным Id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'При попытке снять лайк, переданы, некорректные данные.',
          ),
        );
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card.findById({
    _id: cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundPageError('Карточка c данным Id не найдена');
      }

      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        throw new AccessDeniedError('Отсутствует право доступа');
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundPageError('Данная карточка была удалена');
      }

      res.send({ data: deletedCard });
    })
    .catch(next);
}

module.exports = {
  getCards,
  createNewCard,
  addLikeCard,
  removeLikeCard,
  deleteCard,
};
