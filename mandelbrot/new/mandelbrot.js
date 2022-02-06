var Mandelbrot = {
  vertex: `
  attribute vec2 a_position;
  void main() {
      gl_Position = vec4(a_position, 0, 1);
  }
  `,
  fragment: `
  #define NUM_STEPS   50
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
  uniform float screenx;
  uniform float screeny;
  uniform float ZOOM;
  uniform float x_offsetU;
  uniform float y_offsetU;
  
  uniform bool smoothResult;
  uniform int whichColor;
  uniform vec3 testCol;
  
  int iterNum;
  float zoom;
  float x_offset;
  float y_offset;
  
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

    if(x_offsetU != 0.0) {
      x_offset = x_offsetU;
    } else {
      x_offset = X_OFFSET;
    }

    if(y_offsetU != 0.0) {
      y_offset = y_offsetU;
    } else {
      y_offset = Y_OFFSET;
    }
  
    vec2 z;
    float x,y;
    int steps;

    float normalizedX = (gl_FragCoord.x - (screenx / 2.0)) / screenx * zoom *
                        (screenx / screeny) - x_offset;
    float normalizedY = (gl_FragCoord.y - (screeny / 2.0)) / screeny * zoom *
                        (screenx / screeny) - y_offset;
  
    z.x = normalizedX;
    z.y = normalizedY;
  
    for (int i = 0; i < 100000; i++) {
      
      x = (z.x * z.x - z.y * z.y) + normalizedX;
      y = (z.y * z.x + z.x * z.y) + normalizedY;
      z.x = x;
      z.y = y;

      steps = i;

      float modulus = sqrt(x*x + y*y);
      if (modulus > 20.0) {
        break;
      }

      if(i == iterNum) {
        break;
      }
    }

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
          l = smooth(l,z);
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