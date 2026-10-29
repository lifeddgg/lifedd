"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId = 0;
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform vec2 resolution;
      uniform float time;

      void main() {
        vec2 uv = (
          gl_FragCoord.xy * 2.0 - resolution.xy
        ) / min(resolution.x, resolution.y);

        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);

        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            float wave = fract(
              t - 0.01 * float(j) + float(i) * 0.01
            ) * 5.0;

            float distanceToWave =
              abs(wave - length(uv) + mod(uv.x + uv.y, 0.2));

            color[j] +=
              lineWidth * float(i * i) /
              max(distanceToWave, 0.015);
          }
        }

        // Increase brightness while retaining the original wave effect.
        color *= 2.2;

        // Subtle blue-violet tint for the KIRA background.
        vec3 tint = vec3(0.55, 0.72, 1.0);
        color *= tint;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    scene.add(new THREE.Mesh(geometry, material));

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch (error) {
      console.error("Unable to initialize WebGL:", error);
      geometry.dispose();
      material.dispose();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x050608, 1);

    container.appendChild(renderer.domElement);

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      renderer.setSize(width, height, false);

      uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height
      );
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const clock = new THREE.Clock();

    const animate = () => {
      if (disposed) return;

      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full overflow-hidden"
      style={{ background: "#050608" }}
    />
  );
}