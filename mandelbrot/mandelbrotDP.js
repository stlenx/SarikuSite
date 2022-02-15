let MandelbrotDP = {
  vertex: `
  attribute vec2 a_position;
  void main() {
      gl_Position = vec4(a_position, 0, 1);
  }
  `,
  fragment: `
  #define NUM_STEPS   500
  #define ZOOM_FACTOR 3.0
  #define X_OFFSET    0.5
  #define Y_OFFSET    0.0
  
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  precision mediump int;
  
  uniform int ITERNUM;
  uniform vec2 iResolution;
  uniform vec2 PAN;
  uniform float ZOOM;
  uniform bool smoothResult;
  uniform int whichColor;
  
  int iterNum;
  float zoom;
  
  float hue2rgb(float p, float q, float t){
    if(t < 0.0) t += 1.0;
    if(t > 1.0) t -= 1.0;
    if(t < 0.16) return p + (q - p) * 6.0 * t;
    if(t < 0.5) return q;
    if(t < 0.66) return p + (q - p) * (0.66 - t) * 6.0;
    return p;
  }

  vec3 getColor1(float i) {
    float hueValue = (1.0 / 50.0) * i;
      
    float q = 0.5 + 0.8 - 0.5 * 0.8;
    float p = 2.0 * 0.5 - q;
      
    float r = hue2rgb(p, q, hueValue + 0.33);
    float g = hue2rgb(p, q, hueValue);
    float b = hue2rgb(p, q, hueValue - 0.33);

    return vec3(r, g, b);
  }

  vec3 getColor2(float i) {
    vec3 col = vec3(0.0);

    col += 0.5 + 0.5*cos( 3.0 + i * 0.15 + vec3(0.0,0.6,1.0));

    return col;
  }
  
  vec3 getColor3(float i, vec3 color) {
    vec3 col = vec3(0.0);

    col += 0.5 + 0.5*cos( 3.0 + i * 0.15 + color);

    return col;
  }
  
  float remap(float value, float from1, float to1, float from2, float to2) {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
  }
  
  vec3 getColor4(float i, vec3 color1, vec3 color2) {
    float minR = min(color1.x, color2.x);
    float minG = min(color1.y, color2.y);
    float minB = min(color1.z, color2.z);
    
    float maxR = max(color1.x, color2.x);
    float maxG = max(color1.y, color2.y);
    float maxB = max(color1.z, color2.z);
    
    float max = float(iterNum);
    float newR = remap(i, 0.0, max, minR, maxR);
    float newG = remap(i, 0.0, max, minG, maxG);
    float newB = remap(i, 0.0, max, minB, maxB);

    return vec3(newR, newG, newB);
  }

  float smooth(float l, vec2 z) {
    float sl = l - log2(log2(dot(z,z))) + 2.0;
    return sl;
  }
  
  vec2 quickTwoSum(float a, float b) {
    float s = a + b;
    float e = b - (s - a);
    return vec2(s, e);
  }
  
  vec2 twoSum(float a, float b) {
    float s = a + b;
    float v = s - a;
    float e = (a - (s - v)) + (b - v);
    return vec2(s, e);
  }
  
  vec2 ds_add (vec2 a, vec2 b) {
    vec2 s, t;
    s = twoSum(a.x, b.x);
    t = twoSum(a.y, b.y);
    s.y += t.x;
    s = quickTwoSum(s.x, s.y);
    s.y += t.y;
    s = quickTwoSum(s.x, s.y);
    return s;
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
    if (dsa.x == dsb.x)  {
      if (dsa.y < dsb.y) return -1.0;
      else if (dsa.y == dsb.y) return 0.0;
      else return 1.0;
    }
    else return 1.0;
  }
  
  vec2 ds_set(float a) {
    float split = 4097.0;
    float t = a * split;
    float a_hi = t - (t - a);
    float a_lo = a - a_hi;
    return vec2(a_hi, a_lo);
  }
  
  vec2 twoProd(float a, float b) {
    float p = a * b;
    vec2 aS = ds_set(a);
    vec2 bS = ds_set(b);
    float err = ((aS.x * bS.x - p) + aS.x * bS.y + aS.y * bS.x) + aS.y * bS.y;
    return vec2(p, err);
  }

  vec2 ds_mul (vec2 a, vec2 b) {
    vec2 p;
    
    p = twoProd(a.x, b.x);
    p.y += a.x * b.y;
    p.y += a.y * b.x;
    p = quickTwoSum(p.x, p.y);
    return p;
  }
    
  void main() {
    if(ITERNUM != 0) {
      iterNum = ITERNUM;
    } else {
      iterNum = NUM_STEPS;
    }

    if(ZOOM != 0.0) {
      zoom = ZOOM;
    } else {
      zoom = ZOOM_FACTOR;
    }

    vec2 pixel = (gl_FragCoord.xy / iResolution.xy - 0.5);
    
    vec2 cx = ds_set(pixel.x);
    vec2 cy = ds_set(pixel.y);
    
    cx = ds_mul(cx, ds_set(zoom));
    cy = ds_mul(cy, ds_set(zoom));
    cx = ds_sub(cx, ds_set(0.5)); // 
    
    //vec2 cx = ds_add(vec2(ds_cx0, ds_cx1),ds_mul(e_tx,vec2(ds_z0, ds_z1)));  
    
    vec4 Z = vec4(0.0);
    vec4 C = vec4(cx, cy);
    int steps = 0;
    
    C.xy = ds_add(C.xy, ds_set(PAN.x));
    C.zw = ds_add(C.zw, ds_set(PAN.y));

    for (int i = 0; i < 100000; i++) {
      vec4 Z2;
      Z2.xy = ds_sub(ds_mul(Z.xy, Z.xy), ds_mul(Z.zw, Z.zw));
      Z2.zw = 2.0 * ds_mul(Z.xy, Z.zw);
      Z = vec4(ds_add(Z2.xy, C.xy), ds_add(Z2.zw, C.zw));
      
      steps = i;
      
      vec2 modulus = ds_add(ds_mul(Z.xy, Z.xy), ds_mul(Z.zw, Z.zw));
      if (ds_compare(modulus, ds_set(40.0)) > 0.0) {
        break;
      }
      
      if(i == iterNum) {
        break;
      }
    }
    
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

    if (steps >= iterNum-1) {
        //Paint black
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        //Convert steps counter to float
        float l = float(steps);
        
        //Calculate color
        vec3 col = vec3(0.0);
        
        //If smooth, make it smooth :D
        if(smoothResult) {
          //l = smooth(l,Z);
        }
        
        if(whichColor == 0) {
          col = getColor1(l);
        } else {
          col = getColor2(l);
        }
        
        //Paint with color
        gl_FragColor = vec4(col, 1.0);
    }
  }
  `
}

