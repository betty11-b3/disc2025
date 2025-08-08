window.addEventListener('DOMContentLoaded', () => {
  // -----------------------------
  // 0) Panzoom 및 기본 엘리먼트 가져오기
  // -----------------------------
  const canvas = document.getElementById('canvas');
  const svg = document.getElementById('lines-svg');

  // -----------------------------
  // 1) SVG 선 연결 함수
  // -----------------------------
 function connectLines(centerId, subIds) {
  const centerEl = document.getElementById(centerId);
  if (!centerEl) return;

  const svgRect = svg.getBoundingClientRect();
  const cRect = centerEl.getBoundingClientRect();
  const cx = cRect.left + cRect.width / 2 - svgRect.left;
  const cy = cRect.top  + cRect.height / 2 - svgRect.top;

  subIds.forEach(id => {
    const subEl = document.getElementById(id);
    if (!subEl) return;
    const sRect = subEl.getBoundingClientRect();
    const sx = sRect.left + sRect.width / 2 - svgRect.left;
    const sy = sRect.top  + sRect.height / 2 - svgRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', sx);
    line.setAttribute('y2', sy);
    line.setAttribute('stroke', '#000');
    line.setAttribute('stroke-width', '1.4');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  });
}

  // -----------------------------
  // 2) 팝업 관리용 맵 선언
  // -----------------------------
  const popupMap = new Map();
  const subMap = new Map();

  // -----------------------------
  // 3) 이미지형 노드 클릭 → 팝업
  // -----------------------------
  document.querySelectorAll('.image-node').forEach(node => {
  node.addEventListener('click', () => {
    if (popupMap.has(node)) {
      canvas.removeChild(popupMap.get(node));
      popupMap.delete(node);
      return;
    }

    const popup = document.createElement('div');
    popup.className = 'image-popup';

    const img = document.createElement('img');
    img.src = node.dataset.img;
    img.alt = node.dataset.alt || '이미지를 불러올 수 없습니다.';
    if (node.dataset.imgWidth) img.style.width = node.dataset.imgWidth;
    if (node.dataset.imgHeight) img.style.height = node.dataset.imgHeight;
    popup.appendChild(img);

    const rect = node.getBoundingClientRect();
    const ox = parseInt(node.dataset.offsetX) || 15;
    const oy = parseInt(node.dataset.offsetY) || 10;

    popup.style.left = `${window.scrollX + rect.right + ox}px`;
    popup.style.top = `${window.scrollY + rect.top + oy}px`;

    canvas.appendChild(popup);
    popupMap.set(node, popup);
  });
});

  /*document.querySelectorAll('.image-node').forEach(node => {
    node.addEventListener('click', () => {
      if (popupMap.has(node)) {
        canvas.removeChild(popupMap.get(node));
        popupMap.delete(node);
        return;
      }

      const popup = document.createElement('div');
      popup.className = 'image-popup';

      const img = document.createElement('img');
      img.src = node.dataset.img;
      img.alt = node.dataset.alt || '이미지를 불러올 수 없습니다.';
      if (node.dataset.imgWidth) img.style.width = node.dataset.imgWidth;
      if (node.dataset.imgHeight) img.style.height = node.dataset.imgHeight;
      popup.appendChild(img);

      const rect = node.getBoundingClientRect();
      const ox = parseInt(node.dataset.offsetX) || 15;
      const oy = parseInt(node.dataset.offsetY) || 10;

      popup.style.left = `${window.scrollX + rect.right + ox}px`;
      popup.style.top = `${window.scrollY + rect.top + oy}px`;

      canvas.appendChild(popup);
      popupMap.set(node, popup);
    });
  });*/

  // -----------------------------
  // 4) 확장형 노드 클릭 → 서브노드 생성 & 팝업
  // -----------------------------
// 자동 서브노드 생성 및 팝업 이벤트 연결
function createSubNodesAuto() {
  document.querySelectorAll('.expand-node').forEach(node => {
    const data = JSON.parse(node.dataset.subnodes);

    // 중심 기준 노드 정의
    const centerMap = {
      'n5': 'n5', // 전위 → 자기 자신 기준
      'n6': 'n6'  // 물질공간 → 자기 자신 기준
    };

    const centerId = centerMap[node.id];
    const centerNode = document.getElementById(centerId);

    if (!centerNode) return;

    const canvasRect = canvas.getBoundingClientRect();
    const centerRect = centerNode.getBoundingClientRect();
    const nodeCenterX = (centerRect.left + centerRect.width / 2 - canvasRect.left);
    const nodeCenterY = (centerRect.top + centerRect.height / 2 - canvasRect.top);

    const created = [];

    data.forEach((sub, i) => {
      const sn = document.createElement('div');
      sn.className = 'sub-node';
      sn.textContent = sub.text;
      canvas.appendChild(sn);

      const ang = sub.angle ?? (i * 360 / data.length);
      const rad = (ang * Math.PI) / 180;
      const dist = sub.radius ?? 120;

      sn.style.left = `${nodeCenterX + Math.cos(rad) * dist}px`;
      sn.style.top = `${nodeCenterY + Math.sin(rad) * dist}px`;
      sn.style.opacity = '1';

      sn.addEventListener('click', () => {
  if (popupMap.has(sn)) {
    const popup = popupMap.get(sn);
    canvas.removeChild(popup);
    popupMap.delete(sn);
  } else {
    const popup = document.createElement('div');
    popup.className = 'image-popup';

    const img = document.createElement('img');
    img.src = sub.img;
    img.alt = sub.text;
    popup.appendChild(img);

    // 팬줌 상태를 고려한 노드 중심 좌표 계산
    const transform = panzoomInstance.getTransform();
    const scale = transform.scale;
    const tx = transform.x;
    const ty = transform.y;

    const snRect = sn.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // 노드의 중심 좌표 계산 (브라우저 기준)
    const snCenterX = snRect.left + snRect.width / 2;
    const snCenterY = snRect.top + snRect.height / 2;

    // 팝업 위치 계산 (canvas 내부 좌표로 환산)
    const canvasX = (snCenterX - canvasRect.left - tx) / scale;
    const canvasY = (snCenterY - canvasRect.top - ty) / scale;

    // 팝업 위치 설정
    const offsetX = 60;
    const offsetY = -30;

    popup.style.position = 'absolute';
    popup.style.left = `${canvasX + offsetX}px`;
    popup.style.top = `${canvasY + offsetY}px`;

    canvas.appendChild(popup);
    popupMap.set(sn, popup);
  }
});

      created.push(sn);
    });

    subMap.set(node, created);
  });
}


                      
  // -----------------------------
  // 5) 선 연결
  // -----------------------------
  connectLines('center1', ['n1', 'n2', 'n3', 'n4', 'n5', 'n6']);

  // -----------------------------
  // 6) 팬줌 초기화 및 확대 + 화면 중앙 정렬
  // -----------------------------
  const panzoomInstance = panzoom(canvas, {
    bounds: true,
    autocenter: true,
    zoomDoubleClickSpeed: 1,
    maxZoom: 3,
    minZoom: 0.5
  });

  // 초기 확대 (브라우저 중심 기준 확대)
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  panzoomInstance.zoomAbs(centerX, centerY, 1.5);

  createSubNodesAuto();
});
document.getElementById('home-btn').addEventListener('click', () => {
  window.location.href = "index.html"; // 홈 파일 경로
});
