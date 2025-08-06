document.querySelectorAll('.sub-ellipse').forEach(el => {
    el.addEventListener('click', function (e) {
      e.stopPropagation(); // 부모 wrapper 클릭 방지
      const imgSrc = this.dataset.img;
      const viewer = document.getElementById('concept-viewer');
      const imgTag = document.getElementById('concept-image');

      imgTag.src = imgSrc;
      viewer.style.display = 'flex';
    });
  });

const connections = [
  { center: "center1", subs: ["n1","n2","n3"] },
  { center: "center2", subs: ["n4","n5","n6","n7"] },
  { center: "center3", subs: ["n8","n9","n10","n11"] }
];

function connectLines(centerId, subIds) {
  const svg = document.getElementById("lines-svg");
  const center = document.getElementById(centerId);

  const cRect = center.getBoundingClientRect();
  const cx = cRect.left + cRect.width/2;
  const cy = cRect.top + cRect.height/2;

  subIds.forEach(id => {
    const sub = document.getElementById(id);
    const sRect = sub.getBoundingClientRect();
    const sx = sRect.left + sRect.width/2;
    const sy = sRect.top + sRect.height/2;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", cx);
    line.setAttribute("y1", cy);
    line.setAttribute("x2", sx);
    line.setAttribute("y2", sy);
    line.setAttribute("stroke", "#666");
    line.setAttribute("stroke-width", "1.5");
    svg.appendChild(line);
  });
}

window.onload = () => {
  connections.forEach(conn => connectLines(conn.center, conn.subs));
};
document.querySelectorAll('.sub-ellipse').forEach(el => {
  el.addEventListener('click', function (e) {
    e.stopPropagation(); // 부모 wrapper 클릭 방지
    const imgSrc = this.dataset.img;
    const viewer = document.getElementById('concept-viewer');
    const imgTag = document.getElementById('concept-image');

    imgTag.src = imgSrc;
    viewer.style.display = 'flex';
  });
});

// 다른 곳 클릭 시 닫기
document.addEventListener('click', function () {
  const viewer = document.getElementById('concept-viewer');
  viewer.style.display = 'none';
});

