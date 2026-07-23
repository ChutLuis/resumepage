/* <hero-three variant="icosa|particles|terrain" color="#8b5cf6" opacity="1"> — lightweight three.js hero visuals */
(function () {
  if (customElements.get("hero-three")) return;
  const THREE_URL = "https://unpkg.com/three@0.160.0/build/three.module.js";
  class HeroThree extends HTMLElement {
    async connectedCallback() {
      this.style.display = "block";
      this.style.position = this.style.position || "relative";
      this.style.overflow = "hidden";
      if (!this.style.height) this.style.height = "100%";
      await new Promise(requestAnimationFrame); // let height resolve before checking
      if (!this.clientHeight) this.style.minHeight = this.getAttribute("fallback-height") || "300px";
      const THREE = await import(THREE_URL);
      if (!this.isConnected) return;
      const variant = this.getAttribute("variant") || "icosa";
      const color = new THREE.Color(this.getAttribute("color") || "#8b5cf6");
      const opacity = parseFloat(this.getAttribute("opacity") || "1");
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
      this.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      let update = () => {};
      const mouse = { x: 0, y: 0 };
      this._onMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", this._onMove);

      if (variant === "icosa") {
        camera.position.set(0, 0, 5);
        const geo = new THREE.IcosahedronGeometry(1.7, 1);
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 * opacity })
        );
        const inner = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.7, 1),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.06 * opacity })
        );
        const verts = new THREE.Points(
          geo,
          new THREE.PointsMaterial({ color, size: 0.07, transparent: true, opacity: 0.9 * opacity })
        );
        const halo = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.6, 0)),
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.18 * opacity })
        );
        const group = new THREE.Group();
        group.add(edges, inner, verts, halo);
        scene.add(group);
        update = (t) => {
          group.rotation.y = t * 0.18;
          group.rotation.x = Math.sin(t * 0.12) * 0.25;
          halo.rotation.y = -t * 0.08;
          halo.rotation.z = t * 0.05;
          camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.04;
          camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.04;
          camera.lookAt(0, 0, 0);
        };
      } else if (variant === "particles") {
        camera.position.set(0, 2.2, 8);
        const W = 90, H = 50, sp = 0.35;
        const pos = new Float32Array(W * H * 3);
        let i = 0;
        for (let x = 0; x < W; x++)
          for (let y = 0; y < H; y++) {
            pos[i++] = (x - W / 2) * sp;
            pos[i++] = 0;
            pos[i++] = (y - H / 2) * sp;
          }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const pts = new THREE.Points(
          geo,
          new THREE.PointsMaterial({ color, size: 0.05, transparent: true, opacity: 0.8 * opacity })
        );
        scene.add(pts);
        update = (t) => {
          const p = geo.attributes.position.array;
          let j = 0;
          for (let x = 0; x < W; x++)
            for (let y = 0; y < H; y++) {
              const xi = p[j], zi = p[j + 2];
              p[j + 1] = Math.sin(xi * 0.5 + t) * 0.35 + Math.cos(zi * 0.45 + t * 0.8) * 0.35;
              j += 3;
            }
          geo.attributes.position.needsUpdate = true;
          camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.03;
          camera.lookAt(0, 0, 0);
        };
      } else if (variant === "aquarius") {
        // Aquarius constellation — real star positions (RA hours, Dec degrees), approximate
        camera.position.set(0, 0, 7);
        const stars = {
          eps: [20.79, -9.5, 1.2],   // Albali
          bet: [21.53, -5.57, 1.6],  // Sadalsuud
          alp: [22.10, -0.32, 1.6],  // Sadalmelik
          gam: [22.36, -1.39, 1.2],  // Sadalachbia
          zet: [22.48, 0.02, 1.0],
          eta: [22.59, -0.12, 1.0],
          pi:  [22.42, 1.38, 0.9],
          the: [22.28, -7.78, 1.0],  // Ancha
          iot: [22.11, -13.87, 0.9],
          lam: [22.88, -7.58, 1.0],
          tau: [22.83, -13.59, 0.9],
          del: [22.91, -15.82, 1.4], // Skat
          phi: [23.23, -6.05, 0.9],
          psi: [23.26, -9.09, 1.0],
          s88: [23.16, -21.17, 0.9],
        };
        const edgesDef = [
          ["eps","bet"],["bet","alp"],["alp","gam"],["gam","zet"],["zet","eta"],["gam","pi"],
          ["alp","the"],["the","iot"],["the","lam"],["lam","phi"],["phi","psi"],["psi","s88"],
          ["lam","tau"],["tau","del"],["del","psi"],
        ];
        const toV = ([ra, dec]) => new THREE.Vector3(
          -(ra - 22.05) * 2.1,
          (dec + 8.5) * 0.21,
          (Math.random() - 0.5) * 0.8
        );
        const pos = {};
        for (const k in stars) pos[k] = toV(stars[k]);
        const group = new THREE.Group();
        // constellation lines
        const lp = [];
        for (const [a, b] of edgesDef) lp.push(pos[a].x, pos[a].y, pos[a].z, pos[b].x, pos[b].y, pos[b].z);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lp), 3));
        group.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 * opacity })));
        // stars, sized by brightness; each twinkles with its own phase/speed
        const twinkles = [];
        for (const k in stars) {
          const g = new THREE.BufferGeometry().setFromPoints([pos[k]]);
          const mat = new THREE.PointsMaterial({
            color: stars[k][2] >= 1.4 ? new THREE.Color("#ffffff") : color,
            size: stars[k][2] * 0.11, transparent: true, opacity: 0.95 * opacity,
          });
          twinkles.push({ mat, baseSize: mat.size, baseOp: mat.opacity, phase: Math.random() * Math.PI * 2, speed: 0.8 + Math.random() * 1.8 });
          group.add(new THREE.Points(g, mat));
        }
        // faint background starfield
        const bg = [];
        for (let k = 0; k < 160; k++) bg.push((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -1.5 - Math.random() * 3);
        const bgGeo = new THREE.BufferGeometry();
        bgGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(bg), 3));
        const bgPts = new THREE.Points(bgGeo, new THREE.PointsMaterial({ color, size: 0.035, transparent: true, opacity: 0.45 * opacity }));
        scene.add(bgPts, group);
        update = (t) => {
          for (const tw of twinkles) {
            const s = Math.sin(t * tw.speed + tw.phase);
            const flare = Math.max(0, Math.sin(t * tw.speed * 0.31 + tw.phase * 2.7) - 0.92) * 8; // occasional bright flare
            tw.mat.size = tw.baseSize * (1 + s * 0.22 + flare * 0.6);
            tw.mat.opacity = Math.min(1, tw.baseOp * (0.75 + 0.25 * s + flare));
          }
          group.rotation.y = Math.sin(t * 0.15) * 0.18;
          group.rotation.x = Math.sin(t * 0.11) * 0.06;
          group.position.y = Math.sin(t * 0.35) * 0.1;
          bgPts.rotation.z = t * 0.008;
          camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
          camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.04;
          camera.lookAt(0, 0, 0);
        };
      } else if (variant === "network") {
        camera.position.set(0, 0, 7);
        const N = 90, R = 2.6;
        const nodes = [];
        for (let k = 0; k < N; k++) {
          // points distributed in a flattened ellipsoid
          const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
          const r = R * (0.55 + 0.45 * Math.random());
          nodes.push(new THREE.Vector3(
            r * Math.sin(ph) * Math.cos(th),
            r * Math.cos(ph) * 0.7,
            r * Math.sin(ph) * Math.sin(th)
          ));
        }
        const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes);
        const pts = new THREE.Points(
          nodeGeo,
          new THREE.PointsMaterial({ color, size: 0.09, transparent: true, opacity: 0.95 * opacity })
        );
        // connect each node to its 2 nearest neighbours
        const linePos = [];
        for (let a = 0; a < N; a++) {
          const d = nodes.map((v, b) => ({ b, dist: v.distanceTo(nodes[a]) }))
            .filter((o) => o.b !== a).sort((x, y) => x.dist - y.dist).slice(0, 2);
          for (const { b } of d) linePos.push(nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z);
        }
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePos), 3));
        const lines = new THREE.LineSegments(
          lineGeo,
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.28 * opacity })
        );
        // a few highlighted "hub" nodes
        const hubs = new THREE.Points(
          new THREE.BufferGeometry().setFromPoints(nodes.filter((_, i) => i % 11 === 0)),
          new THREE.PointsMaterial({ color: new THREE.Color("#ffffff"), size: 0.14, transparent: true, opacity: 0.9 * opacity })
        );
        const group = new THREE.Group();
        group.add(pts, lines, hubs);
        scene.add(group);
        update = (t) => {
          group.rotation.y = t * 0.1;
          group.rotation.x = Math.sin(t * 0.15) * 0.12;
          group.position.y = Math.sin(t * 0.4) * 0.12;
          const s = 1 + Math.sin(t * 1.6) * 0.015;
          group.scale.set(s, s, s);
          camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.04;
          camera.position.y += (-mouse.y * 0.6 - camera.position.y) * 0.04;
          camera.lookAt(0, 0, 0);
        };
      } else if (variant === "volcanoes") {
        // Guatemala skyline — Agua, Acatenango, Fuego as a wireframe engraving
        camera.position.set(0, 1.6, 9.5);
        const geo = new THREE.PlaneGeometry(30, 14, 130, 60);
        geo.rotateX(-Math.PI / 2);
        const peak = (x, z, px, pz, h, w) => {
          const d2 = (x - px) * (x - px) + (z - pz) * (z - pz);
          return h * Math.exp(-d2 / (2 * w * w));
        };
        const base = geo.attributes.position.array.slice();
        const p0 = geo.attributes.position.array;
        // sharp volcanic cone: linear slope from summit, slightly concave
        const cone = (x, z, px, pz, h, spread) => {
          const d = Math.sqrt((x - px) * (x - px) + (z - pz) * (z - pz) * 2.2);
          const v = h - d * (h / spread);
          return v > 0 ? v * (0.75 + 0.25 * (v / h)) : 0;
        };
        // ridged noise for rugged rock faces
        const rough = (x, z) =>
          Math.abs(Math.sin(x * 1.7 + z * 0.9)) * 0.22 +
          Math.abs(Math.sin(x * 3.9 - z * 2.3)) * 0.11 +
          Math.abs(Math.cos(x * 0.6 + z * 1.8)) * 0.16;
        for (let k = 0; k < p0.length; k += 3) {
          const x = p0[k], z = p0[k + 2];
          const h =
            cone(x, z, -8.2, -3.5, 4.2, 5.2) +          // Volcán de Agua — tall, wide
            cone(x, z, 4.4, -4.0, 3.3, 3.6) +           // Acatenango
            cone(x, z, 8.6, -3.0, 2.6, 2.8) +           // Fuego — lower, in front
            cone(x, z, -1.5, -5.5, 1.4, 4.0);           // distant saddle between them
          const ridge = h > 0.15 ? rough(x, z) * Math.min(1, h * 0.55) : rough(x, z) * 0.12;
          p0[k + 1] = h + ridge;
          base[k + 1] = p0[k + 1];
        }
        geo.attributes.position.needsUpdate = true;
        geo.computeBoundingSphere();
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.32 * opacity })
        );
        scene.add(mesh);
        update = (t) => {
          const p = geo.attributes.position.array;
          for (let k = 0; k < p.length; k += 3) {
            // gentle heat-haze shimmer over the fixed skyline
            p[k + 1] = base[k + 1] + Math.sin(p[k] * 0.8 + t * 0.7) * 0.03 + Math.cos(p[k + 2] * 1.1 + t * 0.5) * 0.025;
          }
          geo.attributes.position.needsUpdate = true;
          camera.position.x += (mouse.x * 1.1 - camera.position.x) * 0.03;
          camera.lookAt(0, 1.6, 0);
        };
      } else {
        // terrain — fine wireframe landscape, engraving-like
        camera.position.set(0, 2.6, 7);
        const geo = new THREE.PlaneGeometry(26, 14, 110, 55);
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35 * opacity })
        );
        scene.add(mesh);
        update = (t) => {
          const p = geo.attributes.position.array;
          for (let k = 0; k < p.length; k += 3) {
            const x = p[k], z = p[k + 2];
            p[k + 1] =
              Math.sin(x * 0.45 + t * 0.5) * 0.4 +
              Math.cos(z * 0.6 + t * 0.35) * 0.35 +
              Math.sin((x + z) * 0.25 + t * 0.2) * 0.3;
          }
          geo.attributes.position.needsUpdate = true;
          camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03;
          camera.lookAt(0, 0.4, 0);
        };
      }

      const resize = () => {
        const w = this.clientWidth || 1, h = this.clientHeight || 1;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      this._ro = new ResizeObserver(resize);
      this._ro.observe(this);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new THREE.Clock();
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        update(clock.getElapsedTime());
        renderer.render(scene, camera);
      };
      if (reduced) { update(1.5); renderer.render(scene, camera); } else loop();
      this._cleanup = () => renderer.dispose();
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      window.removeEventListener("pointermove", this._onMove);
      if (this._cleanup) this._cleanup();
    }
  }
  customElements.define("hero-three", HeroThree);
})();
