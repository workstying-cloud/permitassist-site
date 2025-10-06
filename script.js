/* === PermitAssist Pro — 360° Enterprise Flow (Canvas, Animated) === */
/* No external libs. Works with:
   <canvas id="flow360-canvas" width="1200" height="680" class="globe"></canvas>
*/
(function () {
  function init() {
    const el = document.getElementById("flow360-canvas");
    if (!el) return;

    const ctx = el.getContext("2d");
    let W = el.width, H = el.height;
    let DPR = Math.max(1, window.devicePixelRatio || 1);

    // Resize to container width and device pixel ratio
    function resize() {
      const parent = el.parentElement || document.body;
      const cssW = Math.max(900, Math.min(parent.clientWidth - 32, 1400)); // responsive width
      const cssH = Math.round(cssW * 0.56);
      W = Math.round(cssW * DPR);
      H = Math.round(cssH * DPR);
      el.style.width = cssW + "px";
      el.style.height = cssH + "px";
      el.width = W;
      el.height = H;
    }
    resize();
    window.addEventListener("resize", resize);

    // Brand colors
    const C_BLACK = "#000000";
    const C_BLUE  = "#2563eb"; // blue
    const C_RED   = "#ef4444"; // red
    const C_WHITE = "#ffffff";
    const C_FAINT = "rgba(255,255,255,0.12)";

    // Design-space mapping (keeps positions readable)
    const D = { w: 1200, h: 680 };
    const X = x => x / D.w * W;
    const Y = y => y / D.h * H;

    // Nodes (id, label, x, y, radius, ring color, fill)
    const nodes = [
      // core
      { id:"core",  label:"Data Core", x:600, y:340, r:56, ring:"#111",    fill:"#0b0b0b" },

      // clouds / platforms (blue / white)
      { id:"aws",   label:"AWS",       x:930, y:575, r:38, ring:C_BLUE,   fill:"#0b1220" },
      { id:"gcp",   label:"GCP",       x:520, y:330, r:38, ring:C_BLUE,   fill:"#0b1220" },
      { id:"snow",  label:"Snowflake", x:1030,y:600, r:40, ring:C_WHITE,  fill:"#0c0c12" },
      { id:"bq",    label:"BigQuery",  x:635, y:250, r:32, ring:C_WHITE,  fill:"#0c0c12" },
      { id:"looker",label:"Looker",    x:720, y: 90, r:32, ring:C_WHITE,  fill:"#0c0c12" },
      { id:"synapse",label:"Synapse",  x:155, y:610, r:36, ring:C_WHITE,  fill:"#0c0c12" },

      // integration / data (red)
      { id:"api",   label:"APIs",      x:865, y:570, r:36, ring:C_RED,    fill:"#1b0b0b" },
      { id:"kafka", label:"Kafka",     x:480, y:690, r:36, ring:C_RED,    fill:"#1b0b0b" },
      { id:"files", label:"Flat Files",x:730, y:520, r:34, ring:C_RED,    fill:"#1b0b0b" },

      // compliance / security (light violet ring)
      { id:"iam",   label:"IAM",       x:1140,y:600, r:38, ring:"#c7bfff", fill:"#0b0a12" },
      { id:"gdpr",  label:"GDPR",      x:390, y:470, r:34, ring:"#c7bfff", fill:"#0b0a12" },
      { id:"bill96",label:"Bill 96",   x:980, y:180, r:32, ring:"#c7bfff", fill:"#0b0a12" },
    ];

    // Edges: [fromId, toId, color]
    const edges = [
      ["core","aws", C_BLUE], ["core","gcp", C_BLUE], ["core","snow", C_WHITE], ["core","bq", C_WHITE],
      ["core","api", C_RED],  ["core","kafka", C_RED],["core","files", C_RED],
      ["api","aws", C_RED],   ["kafka","gcp", C_RED], ["files","snow", C_RED],
      ["gdpr","core", C_WHITE], ["iam","api", C_WHITE], ["bill96","core", C_WHITE],
      ["looker","bq", C_WHITE], ["looker","core", C_WHITE], ["aws","iam", C_WHITE],
      ["synapse","core", C_WHITE], ["synapse","files", C_RED]
    ];

    // Animation ticker
    let t = 0;

    function halo(x, y, r, color) {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 18 * DPR;
      ctx.beginPath();
      ctx.arc(X(x), Y(y), r * DPR + 2*DPR, 0, Math.PI*2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3 * DPR;
      ctx.stroke();
      ctx.restore();
    }

    function drawNode(n) {
      const x = X(n.x), y = Y(n.y), r = n.r * DPR;

      // outer glow
      halo(n.x, n.y, n.r + 2, n.ring);

      // core fill
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.fillStyle = n.fill;
      ctx.fill();

      // ring
      ctx.beginPath();
      ctx.arc(x, y, r + 3*DPR, 0, Math.PI*2);
      ctx.strokeStyle = n.ring;
      ctx.lineWidth = 4 * DPR;
      ctx.stroke();

      // label
      ctx.font = `${12*DPR}px Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      const light = (n.ring === C_RED) ? "#ffd7d7" : (n.ring === C_BLUE ? "#dde9ff" : "#e8e8ff");
      ctx.fillStyle = light;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.label, x, y);
    }

    function drawEdge(a, b, color) {
      const ax = X(a.x), ay = Y(a.y);
      const bx = X(b.x), by = Y(b.y);

      // faint base
      ctx.save();
      ctx.strokeStyle = C_FAINT;
      ctx.lineWidth = 2 * DPR;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();

      // animated flow (moving dash)
      ctx.setLineDash([14*DPR, 12*DPR]);
      ctx.lineDashOffset = -t * 6 * DPR;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10 * DPR;
      ctx.lineWidth = 2.5 * DPR;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.restore();
    }

    function rings() {
      ctx.save();
      ctx.translate(X(D.w/2), Y(D.h/2));
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (80 + i*80) * DPR, 0, Math.PI*2);
        ctx.strokeStyle = i % 2 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1 * DPR;
        ctx.stroke();
      }
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C_BLACK;
      ctx.fillRect(0, 0, W, H);

      rings();

      // draw edges then nodes (so nodes sit on top)
      for (const [s, d, col] of edges) {
        const A = nodes.find(n => n.id === s);
        const B = nodes.find(n => n.id === d);
        if (A && B) drawEdge(A, B, col);
      }
      for (const n of nodes) drawNode(n);

      t += 0.016; // ~60fps
      requestAnimationFrame(frame);
    }
    frame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
