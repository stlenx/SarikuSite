class Font {
    constructor(text) {
        this.text = text;
        this.img = null;
    }

    Generate() {
        if(isNaN(this.text)){
            let canvas = document.createElement("canvas");
            canvas.setAttribute("width", 9 * this.text.length)
            canvas.setAttribute("height", 9);
            let ctx = canvas.getContext("2d");

            for(let i = 0; i < this.text.length; i++) {
                let letter = this.GetLetterCanvas(this.text[i])
                ctx.drawImage(letter, i * 9,0, 9, 9)
            }

            this.img = canvas;
        }else{
            let canvas = document.createElement("canvas");
            canvas.setAttribute("width", 9 * getLength(this.text))
            canvas.setAttribute("height", 9);
            let ctx = canvas.getContext("2d");

            for(let i = 0; i < getLength(this.text); i++) {
                let letter = this.GetNumberCanvas(parseInt(this.text.toString()[i]))
                ctx.drawImage(letter, i * 6,0, 6, 9)
            }

            this.img = canvas;
        }
    }

    GetNumberCanvas(number) {
        let image = new Image();
        image.src = "font/font.png";

        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", 6)
        canvas.setAttribute("height", 9);

        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, (number * 6 + 233) * -1,0, image.width, image.height)

        return canvas;
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