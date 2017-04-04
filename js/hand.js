class Hand {
    constructor() {
        this.cards = []
        this.currentCard
    }

    drawCard() {
        if (this.cards.length > 0)
            this.currentCard = this.cards.pop()
        else
            this.currentCard = null
    }

    addCard(card) {
        this.cards.push(card)
    }
}