let MandelbrotDP = {
  vertex: `
  attribute vec2 a_position;
  void main() {
      gl_Position = vec4(a_position, 0, 1);
  }
  `,
  fragment: `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  precision mediump int;
  
  uniform int iterations;
  uniform float frame;
  uniform float radius;
  
  uniform float ds_z0, ds_z1;
  uniform float ds_w0, ds_w1;
  uniform float ds_h0, ds_h1;
  uniform float ds_cx0, ds_cx1; //X?
  uniform float ds_cy0, ds_cy1; //Y?

  vec2 ds_add (vec2 dsa, vec2 dsb) {
    vec2 dsc;
    float t1, t2, e;
    
    t1 = dsa.x + dsb.x;
    e = t1 - dsa.x;
    t2 = ((dsb.x - e) + (dsa.x - (t1 - e))) + dsa.y + dsb.y;
    
    dsc.x = t1 + t2;
    dsc.y = t2 - (dsc.x - t1);
    return dsc;
  }

  vec2 ds_sub (vec2 dsa, vec2 dsb) {
    vec2 dsc;
    float e, t1, t2;
    
    t1 = dsa.x - dsb.x;
    e = t1 - dsa.x;
    t2 = ((-dsb.x - e) + (dsa.x - (t1 - e))) + dsa.y - dsb.y;
    
    dsc.x = t1 + t2;
    dsc.y = t2 - (dsc.x - t1);
    return dsc;
  }

  float ds_compare(vec2 dsa, vec2 dsb) {
    if (dsa.x < dsb.x) return -1.0;
    else if (dsa.x == dsb.x)  {
      if (dsa.y < dsb.y) return -1.0;
      else if (dsa.y == dsb.y) return 0.0;
      else return 1.0;
    }
    else return 1.0;
  }

  vec2 ds_mul (vec2 dsa, vec2 dsb) {
    vec2 dsc;
    float c11, c21, c2, e, t1, t2;
    float a1, a2, b1, b2, cona, conb, split = 8193.0;
  
    cona = dsa.x * split;
    conb = dsb.x * split;
    a1 = cona - (cona - dsa.x);
    b1 = conb - (conb - dsb.x);
    a2 = dsa.x - a1;
    b2 = dsb.x - b1;
  
    c11 = dsa.x * dsb.x;
    c21 = a2 * b2 + (a2 * b1 + (a1 * b2 + (a1 * b1 - c11)));
  
    c2 = dsa.x * dsb.y + dsa.y * dsb.x;
  
    t1 = c11 + c2;
    e = t1 - c11;
    t2 = dsa.y * dsb.y + ((c2 - e) + (c11 - (t1 - e))) + c21;
    
    dsc.x = t1 + t2;
    dsc.y = t2 - (dsc.x - t1);
   
    return dsc;
  }

  vec2 ds_set(float a) {
    vec2 z;
    z.x = a;
    z.y = 0.0;
    return z;
  }

  float emandel(float x, float y) {
    vec2 e_tx = ds_set(x);
    vec2 e_ty = ds_set(y);
    
    vec2 cx = ds_add(ds_add(vec2(ds_cx0, ds_cx1),ds_mul(e_tx,vec2(ds_z0, ds_z1))),vec2(ds_w0, ds_w1));  
    vec2 cy = ds_add(ds_add(vec2(ds_cy0, ds_cy1),ds_mul(e_ty,vec2(ds_z0, ds_z1))),vec2(ds_h0, ds_h1));  
    
    vec2 tmp;
    
    vec2 zx = cx;
    vec2 zy = cy;
    vec2 two = ds_set(2.0);
    
    vec2 e_radius = ds_set(radius*radius);
    4
    for(int n=0; n<500; n++) {
      tmp = zx;
      zx = ds_add(ds_sub(ds_mul(zx, zx), ds_mul(zy, zy)), cx);
      zy = ds_add(ds_mul(ds_mul(zy, tmp), two), cy);
      
      if( ds_compare(ds_add(ds_mul(zx, zx), ds_mul(zy, zy)), e_radius)>0.0)  {
        return(float(n) + 1. - log(log(length(vec2(zx.x, zy.x))))/log(2.0));
      }
    }
    return 0.0;
  }

  void main() {
    float n = emandel(gl_FragCoord.x, gl_FragCoord.y); 
    
    gl_FragColor = vec4((-cos(0.025*n)+1.0)/2.0, (-cos(0.08*n)+1.0)/2.0, (-cos(0.12*n)+1.0)/2.0, 1.0);
  }
  `
}

