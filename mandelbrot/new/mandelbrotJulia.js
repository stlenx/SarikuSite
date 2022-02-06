var MandelbrotJulia = {
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
  
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  precision mediump int;
  
  uniform int ITERNUM;
  uniform float screenx;
  uniform float screeny;
  uniform float X;
  uniform float Y;
  
  int iterNum;
  
  float hue2rgb(float p, float q, float t){
    if(t < 0.0) t += 1.0;
    if(t > 1.0) t -= 1.0;
    if(t < 0.16) return p + (q - p) * 6.0 * t;
    if(t < 0.5) return q;
    if(t < 0.66) return p + (q - p) * (0.66 - t) * 6.0;
    return p;
  }
    
  void main() {
    if(ITERNUM > 0) {
      iterNum = ITERNUM;
    } else {
      iterNum = NUM_STEPS;
    }
  
    vec2 z;
    float x,y;
    int steps;
    int max;
    max = 50;
    float normalizedX = (gl_FragCoord.x - (screenx / 2.0)) / screenx * ZOOM_FACTOR *
                        (screenx / screeny) - X_OFFSET;
    float normalizedY = (gl_FragCoord.y - (screeny / 2.0)) / screeny * ZOOM_FACTOR;
  
    if(X > 0.0) {
      //replace with X Y
      x = (X - (screenx / 2.0)) / screenx * ZOOM_FACTOR *
                        (screenx / screeny) - X_OFFSET;
      y = (Y - (screeny / 2.0)) / screeny * ZOOM_FACTOR;
    }

    z.x = normalizedX;
    z.y = normalizedY;
  
    for (int i = 0; i < 100000; i++) {
      if(i == iterNum) {
        break;
      }
      
      steps = i;
      x = (z.x * z.x - z.y * z.y) + normalizedX;
      y = (z.y * z.x + z.x * z.y) + normalizedY;
      if((x * x + y * y) > 4.0) {
        break;
      }
      z.x = x;
      z.y = y;
    }
  
    if (steps == iterNum-1) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        float i_float = float(steps);
        float hueValue = (1.0 / 50.0) * i_float;
        
        float q = 0.5 + 0.8 - 0.5 * 0.8;
        float p = 2.0 * 0.5 - q;
  
        float r = hue2rgb(p, q, hueValue + 0.33);
        float g = hue2rgb(p, q, hueValue);
        float b = hue2rgb(p, q, hueValue - 0.33);
  
        gl_FragColor = vec4(r, g, b, 1.0);
    }
  }
  `
}