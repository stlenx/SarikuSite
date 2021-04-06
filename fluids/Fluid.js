function IX(x,y) {
    return x+ (y * N);
}

class Fluid {
    size
    dt
    diff
    visc

    s = []
    density = Array(4096)

    Vx = []
    Vy = []

    Vx0 = []
    Vy0 = []

    constructor(dt, diffusion, viscosity, N) {
        this.size = N;
        this.dt = dt;
        this.diff = diffusion;
        this.visc = viscosity;
    }

    initializeArrays() {
        console.log(this.density.length)
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                this.density.push(1)
            }
        }
        console.log(this.density)
    }

    addDensity(x, y, amount) {
        let index = IX(x,y)
        this.density[index] += amount;
        console.log("added density")
    }

    //REMEMBER THIS USES A VECTOR2 FOR AMOUNT!!
    addVelocity(x, y, amount) {
        let index = IX(x,y)
        this.Vx[index] += amount.x;
        this.Vy[index] += amount.y;
    }

    renderD() {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let x = i * scale;
                let y = j * scale;
                let d = this.density[IX(i, j)];

                ctx.fillStyle = 'rgb(' + d + ',' + d + ',' + d + ')';
                ctx.beginPath();
                ctx.rect(x, y, scale, scale);
                ctx.closePath();
                ctx.fill();
            }
        }
        //console.log(this.density)
    }

    step() {
        diffuse(1, this.Vx0, this.Vx, this.visc, this.dt);
        diffuse(2, this.Vy0, this.Vy, this.visc, this.dt);

        project(this.Vx0, this.Vy0, this.Vx, this.Vy);

        advect(1, this.Vx, this.Vx0, this.Vx0, this.Vy0, this.dt);
        advect(2, this.Vy, this.Vy0, this.Vx0, this.Vy0, this.dt);

        project(this.Vx, this.Vy, this.Vx0, this.Vy0);

        diffuse(0, this.s, this.density, this.diff, this.dt);
        advect(0, this.density, this.s, this.Vx, this.Vy, this.dt);
    }
    
}

function diffuse(b, x, x0, diff, dt) {
    let a = dt * diff * (N - 2) * (N - 2);
    lin_solve(b, x, x0, a, 1 + 6 * a, iter, N);
}

function lin_solve(b, x, x0, a, c) {
    let cRecip = 1.0 / c;
    for (let k = 0; k < iter; k++) {
        for (let j = 1; j < N -1; j++) {
            for (let i = 1; i < N -1; i++) {
                x[IX(i, j)] =
                    (x0[IX(i, j)] + a * (x[IX(i+1, j)] + x[IX(i-1, j)] + x[IX(i, j+1)] + x[IX(i, j-1)])) * cRecip;
            }
        }
        set_bnd(b, x)
    }
}

function project(velocX, velocY, p, div) {
    for (let j = 1; j < N -1; j++) {
        for (let i = 1; i < N -1; i++) {
            div[IX(i, j)] = -0.5 * (velocX[IX(i+1, j)] - velocX[IX(i-1,j)] + velocY[IX(i, j+1)] - velocY[IX(i, j-1)]) / N;
            p[IX(i, j)] = 0;
        }
    }

    set_bnd(0, div)
    set_bnd(0, p)
    lin_solve(0,p,div,1,6)

    for (let j = 1; j < N -1; j++) {
        for (let i = 1; i < N -1; i++) {
            velocX[IX(i, j)] -= 0.5 * (p[IX(i+1, j)] - p[IX(i-1, j)]) * N;
            velocY[IX(i, j)] -= 0.5 * (p[IX(i, j+1)] - p[IX(i, j-1)]) * N;
        }
    }

    set_bnd(1, velocX)
    set_bnd(1, velocY)
}

function advect(b, d, d0, velocX, velocY, dt) {
    let i0, i1, j0, j1;
    let dtx = dt * (N - 2);
    let dty = dt * (N - 2);

    let s0, s1, t0, t1;
    let tmp1, tmp2, x, y;

    let i, j;

    for (j = 1; j < N - 1; j++) {
        for(i = 1; i < N - 1; i++) {
            tmp1 = dtx * velocX[IX(i, j)];
            tmp2 = dty * velocY[IX(i, j)];
            x = i - tmp1;
            y = i - tmp2;

            if(x < 0.5) x = 0.5;
            if(x > N + 0.5) x = N + 0.5;
            i0 = Math.floor(x)
            i1 = i0 + 1;
            if(y < 0.5) y = 0.5;
            if(y > N + 0.5) y = N + 0.5;
            j0 = Math.floor(y);
            j1 = j0 + 1;

            s1 = x - i0;
            s0 = 1 - s1;
            t1 = y - j0;
            t0 = 1 - t1;

            let i0i = parseInt(i0)
            let i1i = parseInt(i1)
            let j0i = parseInt(j0)
            let j1i = parseInt(j1)

            //DOUBLE CHECK!!
            d[IX(i, j)] = s0 * (t0 * d0[IX(i0i, j0i)] + t1 * d0[IX(i0i, j1i)]) + s1 * (t0 * d0[IX(i1i, j0i)] + t1 * d0[IX(i1i, j1i)])
        }
    }

    set_bnd(b, d)
}

function set_bnd(b, x) {
    for (let i = 1; i < N - 1; i++) {
        x[IX(i,0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
        x[IX(i,N-1)] = b === 2 ? -x[IX(i, N-1)] : x[IX(i, N-1)];
    }

    for (let j = 1; j < N - 1; j++) {
        x[IX(0, j)] = b === 2 ? -x[IX(1, j)] : x[IX(1, j)];
        x[IX(N-1, j)] = b === 2 ? -x[IX(N-1, j)] : x[IX(N-1, j)];
    }

    x[IX(0,0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
    x[IX(0, N-1)] = 0.5 * (x[IX(1, N-1)] + x[IX(0, N -2)]);
    x[IX(N-1, 0)] = 0.5 * (x[IX(N-2, 0)] + x[IX(N-1, 1)]);
    x[IX(N-1, N-1)] = 0.5 * (x[IX(N-2, N-1)] + x[IX(N-1, N-2)]);
}