class Card {
    link; title; info; alt; pairedCard;
    constructor(link, title, info, alt) {
        this.link = link;
        this.title = title;
        this.info = info;
        this.alt = alt;
        this.pairedCard = null;
    }



    set pairedCard(newCard) {
        this.pairedCard = newCard;
    }
}
