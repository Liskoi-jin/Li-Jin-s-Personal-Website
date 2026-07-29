import { memo, useEffect, useRef } from "react";
import "./DotField.css";

const TWO_PI = Math.PI * 2;

const DotField = memo(({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "rgba(168, 85, 247, 0.35)",
  gradientTo = "rgba(180, 151, 207, 0.25)",
  glowColor = "#120F17",
  ...rest
}) => {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0, lastMove: 0 });
  const rafRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 });
  const glowOpacity = useRef(0);
  const engagement = useRef(0);
  const propsRef = useRef({});
  const rebuildRef = useRef(null);
  const glowIdRef = useRef(`dot-field-glow-${Math.random().toString(36).slice(2, 9)}`);

  propsRef.current = {
    dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeOnly,
    bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const glowEl = glowRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5);
    let resizeTimer;
    let running = false;
    let visible = true;
    let lastFrame = 0;

    function buildDots(w, h) {
      const p = propsRef.current;
      const step = p.dotRadius + p.dotSpacing;
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      const dots = new Array(rows * cols);
      let index = 0;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          dots[index++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
        }
      }
      dotsRef.current = dots;
    }

    function doResize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const { width: w, height: h } = rect;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      buildDots(w, h);
      draw(performance.now());
    }

    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 100);
    }

    function onMouseMove(event) {
      const mouse = mouseRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const now = performance.now();
      const elapsed = Math.max(now - mouse.lastMove, 16);
      const distance = Math.hypot(x - mouse.prevX, y - mouse.prevY);
      mouse.speed = Math.min((distance / elapsed) * 16, 80);
      mouse.x = x;
      mouse.y = y;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.lastMove = now;
      wake();
    }

    let frameCount = 0;

    function draw(now) {
      frameCount += 1;
      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      const { w, h } = sizeRef.current;
      const props = propsRef.current;
      const time = now * 0.001;
      const targetEngagement = Math.min(mouse.speed / 5, 1);
      engagement.current += (targetEngagement - engagement.current) * 0.06;
      if (engagement.current < 0.001) engagement.current = 0;
      mouse.speed *= 0.88;
      if (mouse.speed < 0.01) mouse.speed = 0;
      const engaged = engagement.current;
      glowOpacity.current += (engaged - glowOpacity.current) * 0.08;

      if (glowEl) {
        glowEl.setAttribute("cx", mouse.x);
        glowEl.setAttribute("cy", mouse.y);
        glowEl.style.opacity = glowOpacity.current;
      }

      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, props.gradientFrom);
      gradient.addColorStop(1, props.gradientTo);
      ctx.fillStyle = gradient;
      const cursorRadiusSq = props.cursorRadius * props.cursorRadius;
      const radius = props.dotRadius / 2;
      ctx.beginPath();

      for (let index = 0; index < dots.length; index += 1) {
        const dot = dots[index];
        const dx = mouse.x - dot.ax;
        const dy = mouse.y - dot.ay;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < cursorRadiusSq && engaged > 0.01) {
          const distance = Math.sqrt(distanceSq);
          const angle = Math.atan2(dy, dx);
          if (props.bulgeOnly) {
            const proximity = 1 - distance / props.cursorRadius;
            const push = proximity * proximity * props.bulgeStrength * engaged;
            dot.sx += (dot.ax - Math.cos(angle) * push - dot.sx) * 0.15;
            dot.sy += (dot.ay - Math.sin(angle) * push - dot.sy) * 0.15;
          } else {
            const move = (500 / Math.max(distance, 1)) * (mouse.speed * props.cursorForce);
            dot.vx += Math.cos(angle) * -move;
            dot.vy += Math.sin(angle) * -move;
          }
        } else if (props.bulgeOnly) {
          dot.sx += (dot.ax - dot.sx) * 0.1;
          dot.sy += (dot.ay - dot.sy) * 0.1;
        }

        if (!props.bulgeOnly) {
          dot.vx *= 0.9;
          dot.vy *= 0.9;
          dot.x = dot.ax + dot.vx;
          dot.y = dot.ay + dot.vy;
          dot.sx += (dot.x - dot.sx) * 0.1;
          dot.sy += (dot.y - dot.sy) * 0.1;
        }

        let drawX = dot.sx;
        let drawY = dot.sy;
        if (props.waveAmplitude > 0) {
          drawY += Math.sin(dot.ax * 0.03 + time) * props.waveAmplitude;
          drawX += Math.cos(dot.ay * 0.03 + time * 0.7) * props.waveAmplitude * 0.5;
        }
        const sparkling = props.sparkle && ((((index * 2654435761) ^ (frameCount >> 3)) >>> 0) % 100 < 3);
        const drawRadius = sparkling ? radius * 1.8 : radius;
        ctx.moveTo(drawX + drawRadius, drawY);
        ctx.arc(drawX, drawY, drawRadius, 0, TWO_PI);
      }
      ctx.fill();
    }

    function tick(now) {
      if (!running || !visible || document.hidden) {
        running = false;
        return;
      }
      if (now - lastFrame >= 1000 / 30) {
        lastFrame = now;
        draw(now);
      }
      const animating = mouseRef.current.speed > 0 || engagement.current > 0.001 || glowOpacity.current > 0.001
        || propsRef.current.waveAmplitude > 0 || propsRef.current.sparkle;
      if (animating) rafRef.current = requestAnimationFrame(tick);
      else running = false;
    }

    function wake() {
      if (running || !visible || document.hidden) return;
      running = true;
      rafRef.current = requestAnimationFrame(tick);
    }

    doResize();
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        running = false;
        cancelAnimationFrame(rafRef.current);
      }
    });
    intersectionObserver.observe(canvas);
    const onVisibilityChange = () => {
      if (!document.hidden) wake();
      else cancelAnimationFrame(rafRef.current);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    rebuildRef.current = () => {
      const { w, h } = sizeRef.current;
      if (w > 0 && h > 0) {
        buildDots(w, h);
        draw(performance.now());
      }
    };

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    rebuildRef.current?.();
  }, [dotRadius, dotSpacing]);

  return (
    <div className="dot-field-container" {...rest}>
      <canvas ref={canvasRef} />
      <svg aria-hidden="true">
        <defs>
          <radialGradient id={glowIdRef.current}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle ref={glowRef} cx="-9999" cy="-9999" r={glowRadius} fill={`url(#${glowIdRef.current})`} />
      </svg>
    </div>
  );
});

DotField.displayName = "DotField";
export default DotField;
