const router = require('express').Router();

const {
  getCards,
  createNewCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createNewCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', addLikeCard);

router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;
