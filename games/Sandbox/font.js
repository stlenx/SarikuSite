class Font {
    constructor(text = "") {
        this.text = text;
        this.img = null;
    }

    Generate() {
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", 9 * this.text.length)
        canvas.setAttribute("height", 9);
        let ctx = canvas.getContext("2d");

        for(let i = 0; i < this.text.length; i++) {
            let letter = this.GetLetterCanvas(this.text[i])
            let pos = this.text[i].charCodeAt(0) - 97
            ctx.drawImage(letter, 9 * i,0, letter.width, letter.height)
        }

        this.img = canvas;
    }

    GetLetterCanvas(letter) {
        let pos = letter.charCodeAt(0) - 97

        let image = new Image();
        image.src = "font/font.png";

        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", 9)
        canvas.setAttribute("height", 9);

        if(pos !== -65) {
            let ctx = canvas.getContext("2d");
            ctx.drawImage(image, -pos * 9,0, image.width, image.height)
        }

        return canvas;
    }
}