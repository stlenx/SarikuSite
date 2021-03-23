class complex {
    real
    img
    constructor(real, img) {
        this.real = real;
        this.img = img;
    }

    sum(one, two) {
        return new complex(one.real + two.real, one.img + two.img);
    }

    multi(one, two) {
        var output = new complex();
        output.real = (two.real * one.real) + ((two.img * one.img) * -1);
        output.img = (two.real * one.img) + (two.img * one.real);
        return output;
    }

    modulus() {
        return Math.sqrt((this.real * this.real)+(this.img * this.img));
    }
}