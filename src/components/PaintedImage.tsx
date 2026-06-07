"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

interface PaintedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  delayMs?: number;
}

interface Point {
  x: number;
  y: number;
}

interface BrushStroke {
  points: Point[];
  distances: number[];
  totalLength: number;
  lineWidth: number;
  delay: number;
  duration: number;
  amplitude: number;
  phase: number;
  frequency: number;
  lastProgress: number;
}

const TAU = Math.PI * 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function createRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let result = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function hasBrightPixel(
  brightPixels: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
) {
  const minX = Math.max(0, x - radiusX);
  const maxX = Math.min(width - 1, x + radiusX);
  const minY = Math.max(0, y - radiusY);
  const maxY = Math.min(height - 1, y + radiusY);

  for (let sampleY = minY; sampleY <= maxY; sampleY += 1) {
    const rowOffset = sampleY * width;
    for (let sampleX = minX; sampleX <= maxX; sampleX += 1) {
      if (brightPixels[rowOffset + sampleX]) return true;
    }
  }

  return false;
}

function createLineArt(
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const lineCanvas = document.createElement("canvas");
  lineCanvas.width = width;
  lineCanvas.height = height;

  const lineContext = lineCanvas.getContext("2d");
  if (!lineContext) return null;

  lineContext.drawImage(image, 0, 0, width, height);

  const source = lineContext.getImageData(0, 0, width, height);
  const output = lineContext.createImageData(width, height);
  const brightPixels = new Uint8Array(width * height);

  for (let pixel = 0; pixel < source.data.length; pixel += 4) {
    const red = source.data[pixel];
    const green = source.data[pixel + 1];
    const blue = source.data[pixel + 2];
    const alpha = source.data[pixel + 3] / 255;
    const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
    const strength = clamp((luminance - 82) / 128, 0, 1) * alpha;
    const index = pixel / 4;

    if (strength > 0.04) {
      brightPixels[index] = 1;
      output.data[pixel] = 237;
      output.data[pixel + 1] = 237;
      output.data[pixel + 2] = 237;
      output.data[pixel + 3] = Math.round(255 * clamp(strength * 1.35, 0, 1));
    }
  }

  lineContext.clearRect(0, 0, width, height);
  lineContext.putImageData(output, 0, 0);

  return { lineCanvas, brightPixels };
}

interface StrokeOptions {
  delay: number;
  lineWidth: number;
  duration?: number;
  amplitude?: number;
}

function addStroke(
  strokes: BrushStroke[],
  random: () => number,
  points: Point[],
  { delay, lineWidth, duration, amplitude }: StrokeOptions,
) {
  if (points.length < 2) return;

  const distances = [0];
  let totalLength = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    totalLength += Math.hypot(current.x - previous.x, current.y - previous.y);
    distances.push(totalLength);
  }

  if (totalLength <= 0) return;

  strokes.push({
    points,
    distances,
    totalLength,
    lineWidth,
    delay,
    duration:
      duration ?? 220 + Math.min(1250, totalLength * (0.58 + random() * 0.32)),
    amplitude: amplitude ?? 1.2 + random() * 4.2,
    phase: random() * TAU,
    frequency: 1.4 + random() * 2.6,
    lastProgress: 0,
  });
}

function linePoints(fromX: number, fromY: number, toX: number, toY: number) {
  return [
    { x: fromX, y: fromY },
    { x: toX, y: toY },
  ];
}

function quadraticPoints(
  fromX: number,
  fromY: number,
  controlX: number,
  controlY: number,
  toX: number,
  toY: number,
  steps = 36,
) {
  const points: Point[] = [];

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const inverse = 1 - progress;

    points.push({
      x:
        inverse * inverse * fromX +
        2 * inverse * progress * controlX +
        progress * progress * toX,
      y:
        inverse * inverse * fromY +
        2 * inverse * progress * controlY +
        progress * progress * toY,
    });
  }

  return points;
}

function arcPoints(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  fromAngle: number,
  toAngle: number,
  steps = 42,
) {
  const points: Point[] = [];

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const angle = fromAngle + (toAngle - fromAngle) * progress;

    points.push({
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
    });
  }

  return points;
}

function spiralPoints(
  centerX: number,
  centerY: number,
  radius: number,
  turns: number,
  clockwise: boolean,
  startAngle: number,
  steps = 44,
) {
  const points: Point[] = [];
  const direction = clockwise ? 1 : -1;

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const angle = startAngle + direction * progress * turns * TAU;
    const currentRadius = radius * (1 - progress * 0.82);

    points.push({
      x: centerX + Math.cos(angle) * currentRadius,
      y: centerY + Math.sin(angle) * currentRadius,
    });
  }

  return points;
}

function createBrushStrokes(
  brightPixels: Uint8Array,
  width: number,
  height: number,
) {
  const random = createRandom(20260107);
  const strokes: BrushStroke[] = [];
  const scaleX = width / 1448;
  const scaleY = height / 1086;
  const x = (value: number) => value * scaleX;
  const y = (value: number) => value * scaleY;
  const line = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    delay: number,
    lineWidth: number,
    amplitude?: number,
  ) => {
    addStroke(strokes, random, linePoints(x(fromX), y(fromY), x(toX), y(toY)), {
      delay,
      lineWidth: lineWidth * Math.max(scaleX, scaleY),
      amplitude,
    });
  };
  const quadratic = (
    fromX: number,
    fromY: number,
    controlX: number,
    controlY: number,
    toX: number,
    toY: number,
    delay: number,
    lineWidth: number,
  ) => {
    addStroke(
      strokes,
      random,
      quadraticPoints(
        x(fromX),
        y(fromY),
        x(controlX),
        y(controlY),
        x(toX),
        y(toY),
      ),
      {
        delay,
        lineWidth: lineWidth * Math.max(scaleX, scaleY),
        amplitude: 2.2,
      },
    );
  };
  const arc = (
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    fromAngle: number,
    toAngle: number,
    delay: number,
    lineWidth: number,
  ) => {
    addStroke(
      strokes,
      random,
      arcPoints(
        x(centerX),
        y(centerY),
        x(radiusX),
        y(radiusY),
        fromAngle,
        toAngle,
      ),
      {
        delay,
        lineWidth: lineWidth * Math.max(scaleX, scaleY),
        amplitude: 2,
      },
    );
  };
  const spiral = (
    centerX: number,
    centerY: number,
    radius: number,
    turns: number,
    clockwise: boolean,
    startAngle: number,
    delay: number,
    lineWidth: number,
  ) => {
    addStroke(
      strokes,
      random,
      spiralPoints(
        x(centerX),
        y(centerY),
        radius * Math.max(scaleX, scaleY),
        turns,
        clockwise,
        startAngle,
      ),
      {
        delay,
        lineWidth: lineWidth * Math.max(scaleX, scaleY),
        amplitude: 1.1,
      },
    );
  };

  quadratic(722, 61, 585, 48, 492, 137, 120, 15);
  quadratic(722, 61, 860, 48, 980, 137, 145, 15);
  quadratic(506, 139, 725, 111, 968, 139, 310, 10);
  arc(723, 180, 255, 66, Math.PI * 1.08, Math.PI * 1.92, 380, 9);

  line(470, 145, 1000, 145, 430, 10, 1.4);
  line(475, 173, 994, 174, 500, 12, 1.4);
  line(340, 238, 475, 320, 580, 11, 1.7);
  line(998, 238, 1142, 318, 580, 11, 1.7);
  line(258, 250, 1238, 253, 660, 13, 1.5);
  line(174, 386, 1276, 385, 800, 15, 1.5);
  line(210, 424, 1246, 424, 900, 18, 1.5);
  line(250, 456, 1198, 456, 980, 17, 1.5);
  line(236, 478, 1212, 478, 1040, 12, 1.4);

  for (let textY = 286; textY <= 365; textY += 20) {
    line(360, textY, 1082, textY + (random() - 0.5) * 5, 720 + textY * 0.9, 11, 1.2);
  }

  const columnCenters = [270, 377, 482, 589, 696, 803, 910, 1016, 1124];

  columnCenters.forEach((center, index) => {
    const baseDelay = 1080 + index * 45;
    line(center - 26, 486, center - 30, 850, baseDelay, 12, 2.5);
    line(center + 26, 486, center + 28, 850, baseDelay + 70, 12, 2.5);
    line(center, 520, center, 842, baseDelay + 130, 8, 2);
    spiral(center - 25, 499, 22, 1.25, false, Math.PI * 0.1, baseDelay - 120, 9);
    spiral(center + 25, 499, 22, 1.25, true, Math.PI * 0.9, baseDelay - 80, 9);
    arc(center, 512, 46, 20, Math.PI * 1.05, Math.PI * 1.95, baseDelay + 20, 8);
  });

  [146, 220, 326, 422, 1216, 1290, 1352].forEach((sideX, index) => {
    line(sideX, 388, sideX + (random() - 0.5) * 8, 868, 1150 + index * 90, 13, 2.4);
  });

  for (let stepY = 850; stepY <= 1010; stepY += 11) {
    const inset = (stepY - 860) * 2.7;
    line(
      190 - inset * 0.35,
      stepY,
      1268 + inset * 0.35,
      stepY + (random() - 0.5) * 4,
      1280 + (stepY - 850) * 6,
      18,
      1.4,
    );
  }

  quadratic(684, 840, 718, 752, 763, 840, 1980, 11);
  line(650, 850, 810, 850, 2100, 13, 1.2);
  line(642, 1002, 812, 1002, 2460, 14, 1.2);

  quadratic(706, 826, 681, 792, 674, 724, 1840, 8);
  quadratic(743, 826, 770, 792, 780, 724, 1860, 8);
  quadratic(704, 792, 684, 846, 695, 914, 1980, 7);
  quadratic(746, 792, 766, 846, 756, 914, 2020, 7);
  quadratic(714, 782, 697, 850, 714, 910, 2080, 7);
  quadratic(736, 782, 752, 850, 734, 910, 2120, 7);
  arc(724, 825, 45, 95, Math.PI * 0.14, Math.PI * 0.86, 2160, 8);
  arc(724, 874, 55, 38, Math.PI * 1.08, Math.PI * 1.92, 2240, 7);
  quadratic(682, 905, 724, 876, 766, 905, 2320, 8);

  for (let scanX = 0; scanX < width; scanX += 9) {
    let runStart = -1;
    let lastBright = -1;

    for (let scanY = 0; scanY < height; scanY += 3) {
      const bright = hasBrightPixel(brightPixels, width, height, scanX, scanY, 4, 2);

      if (bright) {
        if (runStart < 0) runStart = scanY;
        lastBright = scanY;
      } else if (runStart >= 0 && scanY - lastBright > 18) {
        const length = lastBright - runStart;

        if (length > 22) {
          const originalY = runStart / scaleY;
          const delay =
            originalY >= 830
              ? 3300 + (scanX / width) * 180 + random() * 340
              : 560 + (runStart / height) * 1850 + (scanX / width) * 160 + random() * 420;
          addStroke(
            strokes,
            random,
            linePoints(
              scanX + (random() - 0.5) * 7,
              runStart - 7,
              scanX + (random() - 0.5) * 7,
              lastBright + 7,
            ),
            {
            delay,
              lineWidth: 7 + random() * 6,
              amplitude: 2,
            },
          );
        }

        runStart = -1;
        lastBright = -1;
      }
    }

    if (runStart >= 0) {
      const length = lastBright - runStart;

      if (length > 22) {
        const originalY = runStart / scaleY;
        const delay =
          originalY >= 830
            ? 3300 + (scanX / width) * 180 + random() * 340
            : 560 + (runStart / height) * 1850 + (scanX / width) * 160 + random() * 420;
        addStroke(
          strokes,
          random,
          linePoints(
            scanX + (random() - 0.5) * 7,
            runStart - 7,
            scanX + (random() - 0.5) * 7,
            lastBright + 7,
          ),
          {
          delay,
            lineWidth: 7 + random() * 6,
            amplitude: 2,
          },
        );
      }
    }
  }

  for (let scanY = 0; scanY < height; scanY += 3) {
    let runStart = -1;
    let lastBright = -1;

    for (let scanX = 0; scanX < width; scanX += 1) {
      const bright = hasBrightPixel(brightPixels, width, height, scanX, scanY, 2, 3);

      if (bright) {
        if (runStart < 0) runStart = scanX;
        lastBright = scanX;
      } else if (runStart >= 0 && scanX - lastBright > 18) {
        const length = lastBright - runStart;

        if (length > 4) {
          const originalY = scanY / scaleY;
          const delay =
            originalY >= 830
              ? 1320 + (originalY - 830) * 6 + (runStart / width) * 120 + random() * 180
              : 900 + (scanY / height) * 1700 + (runStart / width) * 160 + random() * 420;
          addStroke(
            strokes,
            random,
            linePoints(
              runStart - 7,
              scanY + (random() - 0.5) * 5,
              lastBright + 7,
              scanY + (random() - 0.5) * 5,
            ),
            {
              delay,
              lineWidth: originalY >= 830 ? 9 + random() * 5 : 6 + random() * 5,
              amplitude: 1.2,
            },
          );
        }

        runStart = -1;
        lastBright = -1;
      }
    }

    if (runStart >= 0) {
      const length = lastBright - runStart;

      if (length > 4) {
        const originalY = scanY / scaleY;
        const delay =
          originalY >= 830
            ? 1320 + (originalY - 830) * 6 + (runStart / width) * 120 + random() * 180
            : 900 + (scanY / height) * 1700 + (runStart / width) * 160 + random() * 420;
        addStroke(
          strokes,
          random,
          linePoints(
            runStart - 7,
            scanY + (random() - 0.5) * 5,
            lastBright + 7,
            scanY + (random() - 0.5) * 5,
          ),
          {
            delay,
            lineWidth: originalY >= 830 ? 9 + random() * 5 : 6 + random() * 5,
            amplitude: 1.2,
          },
        );
      }
    }
  }

  return strokes.sort((a, b) => a.delay - b.delay);
}

function getStrokePoint(stroke: BrushStroke, progress: number) {
  const targetLength = stroke.totalLength * clamp(progress, 0, 1);
  let segmentIndex = 1;

  while (
    segmentIndex < stroke.distances.length - 1 &&
    stroke.distances[segmentIndex] < targetLength
  ) {
    segmentIndex += 1;
  }

  const previous = stroke.points[segmentIndex - 1];
  const current = stroke.points[segmentIndex];
  const segmentStart = stroke.distances[segmentIndex - 1];
  const segmentLength = Math.max(1, stroke.distances[segmentIndex] - segmentStart);
  const segmentProgress = (targetLength - segmentStart) / segmentLength;
  const baseX = previous.x + (current.x - previous.x) * segmentProgress;
  const baseY = previous.y + (current.y - previous.y) * segmentProgress;
  const directionX = (current.x - previous.x) / segmentLength;
  const directionY = (current.y - previous.y) / segmentLength;
  const normalX = -directionY;
  const normalY = directionX;
  const wave = Math.sin(progress * TAU * stroke.frequency + stroke.phase);
  const wave2 = Math.sin(progress * TAU * (stroke.frequency * 0.55) + stroke.phase * 0.7);
  const offset = (wave + wave2 * 0.45) * stroke.amplitude;

  return {
    x: baseX + normalX * offset,
    y: baseY + normalY * offset,
  };
}

function drawStrokeSegment(
  context: CanvasRenderingContext2D,
  stroke: BrushStroke,
  fromProgress: number,
  toProgress: number,
) {
  const easedFrom = easeOutCubic(clamp(fromProgress, 0, 1));
  const easedTo = easeOutCubic(clamp(toProgress, 0, 1));
  const steps = Math.max(4, Math.ceil(Math.abs(easedTo - easedFrom) * 28));
  const start = getStrokePoint(stroke, easedFrom);

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(start.x, start.y);

  for (let step = 1; step <= steps; step += 1) {
    const progress = easedFrom + ((easedTo - easedFrom) * step) / steps;
    const point = getStrokePoint(stroke, progress);
    context.lineTo(point.x, point.y);
  }

  context.lineWidth = stroke.lineWidth * 1.45;
  context.strokeStyle = "rgba(255, 255, 255, 1)";
  context.stroke();

  context.lineWidth = stroke.lineWidth;
  context.strokeStyle = "rgba(255, 255, 255, 0.98)";
  context.stroke();

  context.lineWidth = Math.max(1, stroke.lineWidth * 0.28);
  context.strokeStyle = "rgba(255, 255, 255, 0.42)";
  context.translate(Math.sin(stroke.phase) * 3, Math.cos(stroke.phase) * 3);
  context.stroke();
  context.restore();
}

export default function PaintedImage({
  src,
  alt,
  width,
  height,
  className,
  delayMs = 1050,
}: PaintedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let cancelled = false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const image = new window.Image();
    image.decoding = "async";
    image.src = src;

    image.onload = () => {
      if (cancelled) return;

      const lineArt = createLineArt(image, width, height);
      if (!lineArt) return;

      const { lineCanvas, brightPixels } = lineArt;

      context.clearRect(0, 0, width, height);

      if (prefersReducedMotion) {
        context.drawImage(lineCanvas, 0, 0);
        return;
      }

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskContext = maskCanvas.getContext("2d");
      if (!maskContext) return;

      const strokes = createBrushStrokes(brightPixels, width, height);
      const totalDuration = Math.max(
        ...strokes.map((stroke) => stroke.delay + stroke.duration),
      );
      const startTime = window.performance.now() + delayMs;

      const paintFrame = (now: number) => {
        if (cancelled) return;

        const elapsed = now - startTime;

        for (const stroke of strokes) {
          const progress = clamp((elapsed - stroke.delay) / stroke.duration, 0, 1);

          if (progress > stroke.lastProgress) {
            drawStrokeSegment(maskContext, stroke, stroke.lastProgress, progress);
            stroke.lastProgress = progress;
          }
        }

        context.clearRect(0, 0, width, height);
        context.drawImage(lineCanvas, 0, 0);
        context.globalCompositeOperation = "destination-in";
        context.drawImage(maskCanvas, 0, 0);
        context.globalCompositeOperation = "source-over";

        if (elapsed < totalDuration + 120) {
          animationFrame = window.requestAnimationFrame(paintFrame);
        }
      };

      animationFrame = window.requestAnimationFrame(paintFrame);
    };

    return () => {
      cancelled = true;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [delayMs, height, src, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={clsx("block h-auto w-full", className)}
      role="img"
      aria-label={alt}
    >
      {alt}
    </canvas>
  );
}
