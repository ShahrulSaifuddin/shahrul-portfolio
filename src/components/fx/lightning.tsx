'use client'

import * as React from 'react'

/**
 * Adapted from React Bits' <Lightning /> (reactbits.dev). Changes for
 * production: renders at a capped internal resolution (the bolt is soft
 * anyway, and the 10-octave fbm is per-pixel), pauses whenever the canvas is
 * offscreen or the tab is hidden, and draws a single still frame under
 * prefers-reduced-motion instead of animating.
 */
export default function Lightning({
  hue = 160,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
  className,
}: {
  hue?: number
  xOffset?: number
  speed?: number
  intensity?: number
  size?: number
  className?: string
}): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const RENDER_SCALE = 0.6

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * RENDER_SCALE))
      const h = Math.max(1, Math.floor(canvas.clientHeight * RENDER_SCALE))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }
    resize()

    const vertex = `
      attribute vec2 aPosition;
      void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
    `
    const fragment = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      #define OCTAVE_COUNT 10
      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }
      float hash11(float p) { p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
      float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }
      mat2 rotate2d(float t) { float c = cos(t); float s = sin(t); return mat2(c, -s, s, c); }
      float noise(vec2 p) {
        vec2 ip = floor(p); vec2 fp = fract(p);
        float a = hash12(ip); float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0)); float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) { v += a * noise(p); p *= rotate2d(0.45); p *= 2.0; a *= 0.5; }
        return v;
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;
        uv.x += uXOffset;
        uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
        float dist = abs(uv.x);
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
        vec3 col = baseColor * (mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist) * uIntensity;
        // Opaque output, composited with CSS \`mix-blend-mode: screen\`: black
        // is a no-op under screen, so only the arc adds light. Sidesteps
        // alpha-compositing differences between GPU/browser backends.
        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `

    const compile = (src: string, type: number) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }
    const vs = compile(vertex, gl.VERTEX_SHADER)
    const fs = compile(fragment, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(program, name)
    const uRes = u('iResolution')
    const uTime = u('iTime')
    gl.uniform1f(u('uHue'), hue)
    gl.uniform1f(u('uXOffset'), xOffset)
    gl.uniform1f(u('uSpeed'), speed)
    gl.uniform1f(u('uIntensity'), intensity)
    gl.uniform1f(u('uSize'), size)

    let raf = 0
    let running = false
    let elapsed = 0
    let last = performance.now()

    const draw = (now: number) => {
      elapsed += (now - last) / 1000
      last = now
      resize()
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (running) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || reduce) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    if (reduce) {
      elapsed = 2.4
      draw(performance.now())
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      // No loseContext() here: StrictMode re-runs this effect on the same
      // <canvas>, and getContext() would then hand back the dead context.
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
    }
  }, [hue, xOffset, speed, intensity, size])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? 'block size-full'}
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
