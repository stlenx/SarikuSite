function IX(x,y) {
    return x + y * N;
}

class Fluid {
    constructor(dt, diffusion, viscosity) {
        this.dt = dt;
        this.diff = diffusion;
        this.visc = viscosity;

        this.s = new Array(N * N).fill(0);
        this.density = new Array(N * N).fill(0);

        this.Vx = new Array(N * N).fill(0);
        this.Vy = new Array(N * N).fill(0);

        this.Vx0 = new Array(N * N).fill(0);
        this.Vy0 = new Array(N * N).fill(0);
    }

    addDensity(x, y, amount) {
        let index = IX(x,y)
        this.density[index] += amount;
    }

    //REMEMBER THIS USES A VECTOR2 FOR AMOUNT!!
    addVelocity(x, y, amount) {
        let index = IX(x, y);
        this.Vx[index] += amount.x;
        this.Vy[index] += amount.y;
    }

    renderD() {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let d = this.density[IX(i, j)];
                d = d > 255 ? 255 : d;

                let index = (i + j * N) * 4;

                data[index] = d;
                data[index+1] = d;
                data[index+2] = d;
                data[index + 3] = 255;
            }
        }
    }

    step() {

        //var t0 = performance.now()

        diffuse(1, this.Vx0, this.Vx, this.visc, this.dt);
        diffuse(2, this.Vy0, this.Vy, this.visc, this.dt);
        //4 ms both, about 2 each

        //var t1 = performance.now()
        //console.log((t1 - t0) + " milliseconds.")

        project(this.Vx0, this.Vy0, this.Vx, this.Vy);
        //4 ms

        advect(1, this.Vx, this.Vx0, this.Vx0, this.Vy0, this.dt);
        advect(2, this.Vy, this.Vy0, this.Vx0, this.Vy0, this.dt);
        //let output = advectGPU(2, this.Vy, this.Vy0, this.Vx0, this.Vy0, this.dt, N)
        ////console.log(output)
//
        //for(let j = 0; j < N; j++) {
        //    for(let i = 0; i < N; i++) {
        //        this.Vy[IX(i, j)] = output[j][i];
        //        //console.log(output[i][j])
        //    }
        //}
        //set_bnd(2, this.Vy);
        //10 ms both, about 5 each

        project(this.Vx, this.Vy, this.Vx0, this.Vy0);
        //4 ms

        diffuse(0, this.s, this.density, this.diff, this.dt);
        advect(0, this.density, this.s, this.Vx, this.Vy, this.dt);
        //6 ms both, about 3 each
    }
}

const gpu = new GPU();
const advectGPU = gpu.createKernel(function (b, d, d0, velocX, velocY, dt, N) {
    function IX(x,y) {
        return x + y * 500;
    }

    let dtx = dt * (N - 2);
    let dty = dt * (N - 2);

    let Nfloat = 500 - 2;

    let tmp1 = dtx * velocX[this.thread.x + this.thread.y * N];
    let tmp2 = dty * velocY[this.thread.x + this.thread.y * N];
    let x = this.thread.x - tmp1;
    let y = this.thread.y - tmp2;

    if (x < 0.5) x = 0.5;
    if (x > Nfloat + 0.5) x = Nfloat + 0.5;

    let i0 = Math.floor(x);

    let i1 = i0 + 1.0;

    if (y < 0.5) y = 0.5;
    if (y > Nfloat + 0.5) y = Nfloat + 0.5;

    let j0 = Math.floor(y);
    let j1 = j0 + 1.0;

    let s1 = x - i0;
    let s0 = 1.0 - s1;
    let t1 = y - j0;
    let t0 = 1.0 - t1;

    let index = IX(this.thread.x,this.thread.y)
    let s0V = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)])
    let s1V = s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)])

    //rD[56] = 43;
    ////set_bnd(b, d);

    return s0V + s1V;

}).setOutput([500,500]);

function diffuse(b, x, x0, diff, dt) {
    let a = dt * diff * (N - 2) * (N - 2);
    lin_solve(b, x, x0, a, 1 + 6 * a);
}

function lin_solve(b, x, x0, a, c) {
    let cRecip = 1.0 / c;
    for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
            x[IX(i, j)] =
                (x0[IX(i, j)] +
                    a *
                    (x[IX(i + 1, j)] +
                        x[IX(i - 1, j)] +
                        x[IX(i, j + 1)] +
                        x[IX(i, j - 1)])) *
                cRecip;
        }
    }
    set_bnd(b, x);
}

function project(velocX, velocY, p, div) {
    for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
            div[IX(i, j)] =
                (-0.5 *
                    (velocX[IX(i + 1, j)] -
                        velocX[IX(i - 1, j)] +
                        velocY[IX(i, j + 1)] -
                        velocY[IX(i, j - 1)])) /
                N;
            p[IX(i, j)] = 0;
        }
    }

    set_bnd(0, div);
    set_bnd(0, p);
    lin_solve(0, p, div, 1, 6);

    for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
            velocX[IX(i, j)] -= 0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) * N;
            velocY[IX(i, j)] -= 0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) * N;
        }
    }

    set_bnd(1, velocX);
    set_bnd(2, velocY);
}

function advect(b, d, d0, velocX, velocY, dt) {
    let i0, i1, j0, j1;

    let dtx = dt * (N - 2);
    let dty = dt * (N - 2);

    let s0, s1, t0, t1;
    let tmp1, tmp2, x, y;

    let Nfloat = N - 2;

    for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
            tmp1 = dtx * velocX[IX(i, j)];
            tmp2 = dty * velocY[IX(i, j)];
            x = i - tmp1;
            y = j - tmp2;

            x = x < 0.5 ? 0.5 : x;
            x = x > Nfloat + 0.5 ? Nfloat + 0.5 : x;

            i0 = Math.floor(x);
            i1 = i0 + 1.0;

            y = y < 0.5 ? 0.5 : y;
            y = y > Nfloat + 0.5 ? Nfloat + 0.5 : y;

            j0 = Math.floor(y);
            j1 = j0 + 1.0;

            s1 = x - i0;
            s0 = 1.0 - s1;
            t1 = y - j0;
            t0 = 1.0 - t1;

            d[IX(i, j)] =
                s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
                s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
        }
    }
    set_bnd(b, d);
}

function set_bnd(b, x) {
    for (let i = 1; i < N - 1; i++) {
        x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
        x[IX(i, N - 1)] = b === 2 ? -x[IX(i, N - 2)] : x[IX(i, N - 2)];
    }
    for (let j = 1; j < N - 1; j++) {
        x[IX(0, j)] = b === 1 ? -x[IX(1, j)] : x[IX(1, j)];
        x[IX(N - 1, j)] = b === 1 ? -x[IX(N - 2, j)] : x[IX(N - 2, j)];
    }

    x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
    x[IX(0, N - 1)] = 0.5 * (x[IX(1, N - 1)] + x[IX(0, N - 2)]);
    x[IX(N - 1, 0)] = 0.5 * (x[IX(N - 2, 0)] + x[IX(N - 1, 1)]);
    x[IX(N - 1, N - 1)] = 0.5 * (x[IX(N - 2, N - 1)] + x[IX(N - 1, N - 2)]);
}